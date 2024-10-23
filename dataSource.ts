import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import databaseOptions from './dataSource.config';
dotenv.config();

const dataSource = new DataSource(databaseOptions);
export default dataSource;
