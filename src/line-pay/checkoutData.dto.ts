// {
// method: "POST",
// baseUrl: targetAPIServer,
// apiPath: "/v3/payments/request",
// data: {
//   amount: 100,
//   currency: "JPY",
//   orderId: "EXAMPLE_ORDER_20230422_1000001",
//   packages: [
//     {
//       id: "1",
//       amount: 100,
//       products: [
//         {
//           id: "PEN-B-001",
//           name: "Pen Brown",
//           imageUrl: "https://store.example.com/images/pen_brown.jpg",
//           quantity: 2,
//           price: 50,
//         },
//       ],
//     },
//   ],
//   redirectUrls: {
//     confirmUrl: "https://store.example.com/order/payment/authorize",
//     cancelUrl: "https://store.example.com/order/payment/cancel",
//   },
//   },
// }
