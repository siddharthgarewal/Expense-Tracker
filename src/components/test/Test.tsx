import { addDoc, collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";

function Test() {
  const [data, setData] = useState("");

  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "test"), { testing: data });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getData = async () => {
    try {
      await getDocs(collection(db, "test")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(newData);
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <input
        value={data}
        type="text"
        onChange={(event: any) => setData(event.target.value)}
      />
      <button onClick={() => addData()}>Save Data</button>
      <button onClick={() => getData()}>Get Data</button>
    </div>
  );
}

export default Test;
