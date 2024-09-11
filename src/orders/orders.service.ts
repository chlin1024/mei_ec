import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDto } from './dto/order.dto';
import { OrderItem } from './entities/orderItem.entity';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { UsersService } from '../users/users.service';
import { QueryOrderDto } from './dto/queryOrder.dto';
import { ProductsService } from '../products/products.service';
import { FinancialStatus } from './orderStatus.enum';
import { CheckoutTransaction } from './entities/checkoutTransaction.entity';
import { OrderTransaction } from './entities/orderTransaction.entity';
import { RefundTransaction } from './entities/refundTransaction.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(CheckoutTransaction)
    private checkoutTransactionRepository: Repository<CheckoutTransaction>,
    private userService: UsersService,
    private productsService: ProductsService,
    private dataSource: DataSource,
  ) {}

  async findRole(id: number) {
    const user = await this.userService.getUserById(id);
    if (user.role === 'admin') {
      return 'admin';
    }
    if (user.role === 'guest') {
      return 'guest';
    }
  }

  async createOrder(orderDto: OrderDto, userId: number) {
    const { adminId, address, note, orderItems } = orderDto;
    const admin = await this.findRole(adminId);
    const guest = await this.findRole(userId);

    if (admin !== 'admin') {
      throw new UnauthorizedException();
    }

    if (guest !== 'guest') {
      throw new UnauthorizedException();
    }
    const createOrder = {
      adminId,
      guestId: userId,
      address,
      note,
    };
    const orderDraft = await this.ordersRepository.create(createOrder);
    const result = await this.ordersRepository.insert(orderDraft);
    const newOrder = result.generatedMaps[0];
    for (const item of orderItems) {
      const createOrderItem = { ...item, orderId: newOrder.id };
      const orderitemDraft = this.orderItemsRepository.create(createOrderItem);
      await this.orderItemsRepository.insert(orderitemDraft);
    }
    const user = await this.userService.getUserById(userId);
    const orderData = {
      guestInfo: {
        name: user.name,
        address: user.email,
      },
      orderInfo: {
        ...orderDto,
        guestId: userId,
        orderId: newOrder.id,
        financialStatus: newOrder.financialStatus,
        fulfillmentStatus: newOrder.fulfillmentStatus,
      },
    };
    return orderData;
  }

  async getOrderById(id: number) {
    const query = this.ordersRepository.createQueryBuilder('order');
    const order = await query
      .andWhere('order.id = :id', { id })
      .andWhere('order.deletedAt IS NULL')
      .leftJoinAndSelect('order.admin', 'admin')
      .leftJoinAndSelect('order.guest', 'guest') //如何只顯示user id，現在user連password都return
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .getOne();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async deleteOrderById(id: number) {
    await this.orderItemsRepository.softDelete({ order: { id } });
    return await this.ordersRepository.softDelete(id);
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const {
      adminId,
      guestId,
      address,
      financialStatus,
      fulfillmentStatus,
      note,
      orderItems,
    } = updateOrderDto;

    const updateOrderData = {
      adminId,
      guestId,
      address,
      financialStatus,
      fulfillmentStatus,
      note,
    };
    if (adminId) {
      const admin = await this.findRole(adminId);
      if (admin !== 'admin') {
        throw new UnauthorizedException(); //Q:用什麼exception比較好
      }
    }
    if (guestId) {
      const guest = await this.findRole(guestId);

      if (guest !== 'guest') {
        throw new UnauthorizedException();
      }
    }
    if (orderItems) {
      for (const item of orderItems) {
        await this.orderItemsRepository.update(
          { order: { id: id }, product: { id: item.productId } },
          { quantity: item.quantity },
        );
      }
    }
    function needUpdate(updateOrderData) {
      for (const key in updateOrderData) {
        if (updateOrderData[key] !== undefined) {
          return true;
        }
      }
      return false;
    }
    const orderNeedUpdate = needUpdate(updateOrderData);

    let result;
    if (orderNeedUpdate) {
      result = await this.ordersRepository.update(id, {
        ...updateOrderData,
      });
    }
    return result;
  }

  // async getOrderByUserId(id: number) {
  //   const query = this.ordersRepository.createQueryBuilder('order');
  //   const order = await query
  //     .andWhere('order.guest = :guest', { guest: id })
  //     .andWhere('order.deletedAt IS NULL')
  //     .leftJoinAndSelect('order.orderItems', 'orderItem')
  //     .getMany();
  //   if (!order) {
  //     throw new NotFoundException(`User ${id} Order not found`);
  //   }
  //   return order;
  // }

  async getOrder(queryOrderDto: QueryOrderDto, userId: number) {
    const {
      address,
      financialStatus,
      fulfillmentStatus,
      orderBy,
      page,
      limit,
    } = queryOrderDto;
    const query = this.ordersRepository.createQueryBuilder('order');
    if (address) {
      query.andWhere('order.address LIKE :address', {
        address: `%${address}%`,
      });
    }
    if (financialStatus) {
      query.andWhere('order.financialStatus = :financialStatus', {
        financialStatus,
      });
    }
    if (fulfillmentStatus) {
      query.andWhere('order.fulfillmentStatus = :fulfillmentStatus', {
        fulfillmentStatus,
      });
    }

    if (orderBy) {
      const cleanOrderBy = orderBy.replace(/^'|'$/g, '');
      const orderColumn = cleanOrderBy.split(':')[0];
      const orderType = cleanOrderBy.split(':')[1].toUpperCase() as
        | 'ASC'
        | 'DESC';
      query.orderBy(`order.${orderColumn}`, orderType);
    }
    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const results = await query
      .andWhere('order.guest = :guest', { guest: userId })
      .andWhere('order.deletedAt IS NULL')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .getMany();
    return results;
  }

  async checkoutOrder(orderId: number) {
    const order = await this.getOrderById(orderId);
    if (
      order.financialStatus === FinancialStatus.PAID ||
      order.financialStatus === FinancialStatus.REFUND
    ) {
      throw new ConflictException('Order is already paid or refunded');
    }
    //計算金額
    let amount: number = 0;
    for (const item of order.orderItems) {
      const price = await this.productsService.getProductPrice(item.productId);
      console.log(price.price * item.quantity);
      const sell = price.price * item.quantity;
      console.log(typeof sell, sell);
      amount += sell;
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //串接linepay

      //存transaction
      const createCheckout = {
        order_id: orderId,
        amount,
      };
      const checkoutDraft = queryRunner.manager.create(
        CheckoutTransaction,
        createCheckout,
      );
      const newCheckout = await queryRunner.manager.save(
        CheckoutTransaction,
        checkoutDraft,
      );
      const saveTransaction = {
        order_id: orderId,
        checkout_transaction_id: newCheckout.id,
      };
      const draft = queryRunner.manager.create(
        OrderTransaction,
        saveTransaction,
      );
      await queryRunner.manager.save(OrderTransaction, draft);
      await queryRunner.manager.update(Order, orderId, {
        financialStatus: FinancialStatus.PAID,
      });
      await queryRunner.commitTransaction();
      return newCheckout;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async getCheckoutTransactionById(id: number) {
    const query = this.checkoutTransactionRepository.createQueryBuilder(
      'checkout_transaction',
    );
    const checkoutTransaction = await query
      .where('checkout_transaction.order_id = :id', { id })
      .getOne();
    if (!checkoutTransaction) {
      throw new NotFoundException(`Checkout with ID ${id} not found`);
    }
    return checkoutTransaction;
  }

  async refundOrder(orderId: number) {
    const order = await this.getOrderById(orderId);
    if (
      order.financialStatus === FinancialStatus.PENDING ||
      order.financialStatus === FinancialStatus.REFUND
    ) {
      throw new ConflictException('Order is already refunded or is not paid');
    }
    const checkoutTransaction = await this.getCheckoutTransactionById(orderId);
    const amount = checkoutTransaction.amount;
    if (!checkoutTransaction) {
      throw new ConflictException('Checkout Transaction does not exsist');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const createRefund = {
        order_id: orderId,
        amount,
      };
      const refundDraft = queryRunner.manager.create(
        RefundTransaction,
        createRefund,
      );
      const newRefund = await queryRunner.manager.save(
        RefundTransaction,
        refundDraft,
      );
      const saveTransaction = {
        order_id: orderId,
        refund_transaction_id: newRefund.id,
      };
      const draft = queryRunner.manager.create(
        OrderTransaction,
        saveTransaction,
      );
      await queryRunner.manager.save(OrderTransaction, draft);
      await queryRunner.manager.update(Order, orderId, {
        financialStatus: FinancialStatus.REFUND,
      });
      await queryRunner.commitTransaction();
      return newRefund;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
