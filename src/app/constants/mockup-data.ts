import { Status } from '../models/models';

export const transactions = [
    {
        Consumer: {
            Name: 'Pranav',
            Area: 'HSR layout'
        },
        Retailer: {
            Name: 'Nishanth',
            Area: 'JP nagar'
        },
        OrderDetails: {
            OrderDate: '20/01/2020',
            ItemsPurchased: [
                {
                    ItemName: 'Sample Item',
                    ItemPrice: 500,
                    Quantity: 2,
                }
            ],
            TotalPrice: 1000
        },
        Status: Status.DELIVERED
    },
    {
        Consumer: {
            Name: 'Vijay',
            Area: 'HSR layout'
        },
        Retailer: {
            Name: 'Nishanth',
            Area: 'JP nagar'
        },
        OrderDetails: {
            OrderDate: '22/01/2020',
            ItemsPurchased: [
                {
                    ItemName: 'Sample Item2',
                    ItemPrice: 300,
                    Quantity: 2,
                }
            ],
            TotalPrice: 600
        },
        Status: Status.CANCELLED
    },
    {
        Consumer: {
            Name: 'Vijay',
            Area: 'HSR layout'
        },
        Retailer: {
            Name: 'Nishanth',
            Area: 'JP nagar'
        },
        OrderDetails: {
            OrderDate: '22/01/2020',
            ItemsPurchased: [
                {
                    ItemName: 'Sample Item2',
                    ItemPrice: 300,
                    Quantity: 2,
                }
            ],
            TotalPrice: 600
        },
        Status: Status.PACKED
    },
    {
        Consumer: {
            Name: 'Pranav',
            Area: 'HSR layout'
        },
        Retailer: {
            Name: 'Nishanth',
            Area: 'JP nagar'
        },
        OrderDetails: {
            OrderDate: '20/01/2020',
            ItemsPurchased: [
                {
                    ItemName: 'Sample Item',
                    ItemPrice: 500,
                    Quantity: 2,
                }
            ],
            TotalPrice: 1000
        },
        Status: Status.DISPATCHED
    },
    {
        Consumer: {
            Name: 'Pranav',
            Area: 'HSR layout'
        },
        Retailer: {
            Name: 'Nishanth',
            Area: 'JP nagar'
        },
        OrderDetails: {
            OrderDate: '20/01/2020',
            ItemsPurchased: [
                {
                    ItemName: 'Sample Item',
                    ItemPrice: 500,
                    Quantity: 2,
                }
            ],
            TotalPrice: 1000
        },
        Status: Status.ORDERED
    }
];


export const analytics = [
    {
        name: 'Critical',
        count: 60
    },
    {
        name: 'Ordered',
        count: 16
    },
    {
        name: 'Packed',
        count: 43
    },
    {
        name: 'Delivered',
        count: 64
    },
    {
        name: 'Clients',
        count: 20
    },
];

export const Orders = [
    {consumer: 'Pranav', shop: 'Kirana', phone: 9206877149, status: Status.PACKED, total: 50000, time_left: '5 min' },
    {consumer: 'Pranav', shop: 'Kirana', phone: 9206877149, status: Status.PACKED, total: 50000, time_left: '5 min' },
    {consumer: 'Pranav', shop: 'Kirana', phone: 9206877149, status: Status.PACKED, total: 50000, time_left: '5 min' },
    {consumer: 'Pranav', shop: 'Kirana', phone: 9206877149, status: Status.PACKED, total: 50000, time_left: '5 min' },
    {consumer: 'Pranav', shop: 'Kirana', phone: 9206877149, status: Status.PACKED, total: 50000, time_left: '5 min' },
    {consumer: 'Pranav', shop: 'Kirana', phone: 9206877149, status: Status.PACKED, total: 50000, time_left: '5 min' },
    {consumer: 'Pranav', shop: 'Kirana', phone: 9206877149, status: Status.PACKED, total: 50000, time_left: '5 min' },
  ];

export const Items = [
    {
        name: 'Parle Monaco Sweet and Salty Biscuits',
        unit: '200g',
        // tslint:disable-next-line:max-line-length
        description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor in doloribus aperiam iure praesentium quod excepturi magnam, eum perferendis natus ducimus inventore debitis molestiae ipsam ratione autem recusandae maxime officia.',
        variety: ['Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores'],
        price: '0.1$'
    },
    {
        name: 'Rice',
        unit: '1kg',
        // tslint:disable-next-line:max-line-length
        description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor in doloribus aperiam iure praesentium quod excepturi magnam, eum perferendis natus ducimus inventore debitis molestiae ipsam ratione autem recusandae maxime officia.',
        variety: ['Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores',
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores'],
        price: '1$'
    },
];
