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
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvgHIBAkdR7DW1RxTPVj_W0VI7Sy0kX30",
  authDomain: "amponsahclothing.firebaseapp.com",
  projectId: "amponsahclothing",
  storageBucket: "amponsahclothing.appspot.com",
  messagingSenderId: "773687035430",
  appId: "1:773687035430:web:89760cc59f530b6d4288e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//i wan to have the id of the user as the id of the book

type Book = {
  //use nano id

  //use nano id

  title: string;
  price: number;
  imageUrl: string;

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
