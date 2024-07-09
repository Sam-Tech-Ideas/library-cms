import { useCallback } from "react";

import { User as FirebaseUser } from "firebase/auth";
import {
  Authenticator,
  buildCollection,
  buildEntityCallbacks,
  FirebaseCMSApp,
} from "firecms";
import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

// TODO: Replace with your config
// const firebaseConfig = {
//   apiKey: "AIzaSyBN1ueTkWPxii2jA8nN8bXfcdt0VJOldQ0",
//   authDomain: "natrendies-e7e65.firebaseapp.com",
//   projectId: "natrendies-e7e65",
//   storageBucket: "natrendies-e7e65.appspot.com",
//   messagingSenderId: "695156067564",
//   appId: "1:695156067564:web:f8eca07a36426363f3e9c9",
// };
const firebaseConfig = {
  apiKey: "AIzaSyB-zCBj2kML0G0KT0wMbqFr-OTsZ8Nwkc0",
  authDomain: "kez-app.firebaseapp.com",
  projectId: "kez-app",
  storageBucket: "kez-app.appspot.com",
  messagingSenderId: "927347947047",
  appId: "1:927347947047:web:e4ad1a74b31fb549180002",
};


//i wan to have the id of the user as the id of the book

type Book = {
  //use nano id
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  quantity: number;
  // genre: string;
};
const bookCallbacks = buildEntityCallbacks({
  onPreSave: ({ entityId, values }) => {
    // Set the 'id' property to the document ID using nanoid()
    values.id = entityId;
    return values;
  },
});

const productsCollection = buildCollection<Book>({
  name: "products",
  singularName: "Product",
  path: "products",
  permissions: ({}) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),

  properties: {


    title: {
      name: "Title",
      dataType: "string",
      validation: { required: true },
    },
    price: {
      name: "Price",
      dataType: "number",
      validation: { required: true },
    },
    
    imageUrl: {
      name: "Product image",
      dataType: "string",
      storage: {
        storagePath: "products",
        storeUrl: true,
      },
    },

    quantity: {
      name: "Quantity",
      dataType: "number",
      validation: { required: true },
    },
   description: {
      name: "Description",
      dataType: "string",
      validation:{required : false}
     
    },
    
  

  },

  callbacks: bookCallbacks,
});





type User = {
  name: string;
  email: string;
  phone: string;
  //address: string;
};

const usersCollection = buildCollection<User>({
  name: "users",
  singularName: "Patron",
  path: "users",
  permissions: ({}) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),

  properties: {
    name: {
      name: "Name",
      dataType: "string",
      validation: { required: true },
    },
    email: {
      name: "Email",
      dataType: "string",
      validation: { required: true },
    },
    phone: {
      name: "Phone",
      dataType: "string",

      validation: { required: true },
    },
  
  },
});

export default function App() {
  const myAuthenticator: Authenticator<FirebaseUser> = useCallback(
    async ({ user, authController }) => {
      if (user?.email?.includes("flanders")) {
        throw Error("Stupid Flanders!");
      }

      console.log("Allowing access to", user?.email);
      // This is an example of retrieving async data related to the user
      // and storing it in the controller's extra field.
      const sampleUserRoles = await Promise.resolve(["admin"]);
      authController.setExtra(sampleUserRoles);

      return true;
    },
    []
  );

  return (
    <FirebaseCMSApp
      name={"Library Management admin"}
      authentication={myAuthenticator}
      collections={[productsCollection, usersCollection]}
      firebaseConfig={firebaseConfig}
    />
  );
}


