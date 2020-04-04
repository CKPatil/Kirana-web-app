import { Time } from '@angular/common';

export const Status = {
    DELIVERED: 'Delivered',
    ORDERED: 'Ordered',
    PACKED: 'Packed',
    CANCELLED: 'Cancelled',
    DISPATCHED: 'Dispatched'
};
class variants_details {
  p_id: number;
  variant: string;
  quantity: string;

}
// tslint:disable-next-line: class-name
export class _Items  {
    name: string;
    category: string;
    sub_category: string;
    brand: string;
    variant_details: variants_details[];
    quantity_type: string;
    details: string;
}
export class DeleteItems {
  category: string;
  subCategory: string;
  Brand: string;
  name: string;
  id: number;
}
// class Consumer {

// }
// class Retailer
// class ItemsPurchased
// class OrderDetails
// export class Transactions {
//   Consumer: Consumer;
//   Retailer: Retailer;
//   OrderDetails: OrderDetails;
//   Status: string;
// }
export class Sent {
  category: string;
  sub_catogery: string;
  details: string;
  brand: string;
  quantity_type: string;
  name: string;
  variants: string[];
}
export class Transactions {
  retailer_name: string;
  bill_no: string;
  quantity: number;
  price: string;
  payment_type: string;
  products: string[];
  id: number;
  order_date: Date;
  order_time: Time;
  status: string;
  vendor_name: string;
  vendor_address: string;
  customer_address: string;
  customer_name: string;
  customer_phone: number;
  }
