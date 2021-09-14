export class product {
    constructor(public id:number, public first_name : String,public added : boolean, public last_name : String, public current_location : String, public current_company : String, public total_experience : String, profile_picture : String, current_role : String) {}
   }
   
   export const productsCollection = [
     {
       id: 2,
       name: 'Adidas sports shoes',
       price: 249.99,
       currency: 'EUR',
       image: 'images/02.jpg',
       url: 'https://images-na.ssl-images-amazon.com/images/I/81t38mrch6L._UL1500_.jpg'
     },
     {
       id: 4,
       name: 'Adidas',
       price: 239.99,
       currency: 'EUR',
       image: 'images/04.jpg',
       url: 'https://images-na.ssl-images-amazon.com/images/I/81t38mrch6L._UL1500_.jpg'
     },
     {
       id: 6,
       name: 'PUMA sports ',
       price: 119.99,
       currency: 'EUR',
       image: 'images/06.jpg',
       url: 'https://images-na.ssl-images-amazon.com/images/I/81t38mrch6L._UL1500_.jpg'
     },
     {
       id: 5,
       name: 'puma track',
       price: 599.99,
       currency: 'EUR',
       image: 'images/05.jpg',
       url: 'https://images-na.ssl-images-amazon.com/images/I/81t38mrch6L._UL1500_.jpg'
     },
     {
       id: 3,
       name: 'Adidas track',
       price: 149.99,
       currency: 'EUR',
       image: 'images/03.jpg',
       url: 'https://images-na.ssl-images-amazon.com/images/I/81t38mrch6L._UL1500_.jpg'
     },
      {
       id: 9,
       name: 'United Color beniton',
       price: 499.99,
       currency: 'EUR',
       image: 'images/01.jpg',
       url: 'https://images-na.ssl-images-amazon.com/images/I/81t38mrch6L._UL1500_.jpg'
     }
   ];
   