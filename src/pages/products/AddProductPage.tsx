import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import { supabase } from "../../store/supabase";

const AddProductPage: React.FC = () => {
  const history = useHistory();

  const [name, setName] = useState<any>("");
  const [description, setDescription] = useState<any>("");
  const [quantity, setQuantity] = useState<any>("");
  const [price, setPrice] = useState<any>("");
  const [category, setCategory] = useState<any>("");

  // used to render platform specific alerts
  const [present] = useIonAlert();

  const doAddProduct = async () => {
    console.log({
      name,
      description,
      quantity,
      price,
      category,
      updated_at: new Date(),
    });

    // STEP 2 - ADD PRODUCT INFO TO DATABASE
    // https://supabase.io/docs/reference/javascript/upsert
    const { data, error } = await supabase.from("products").upsert({
      name,
      description,
      quantity,
      price,
      category,
    });

    // error check for adding product...
    if (error) {
      present({
        header: "Error Creating New Product",
        message: error?.message,
        buttons: ["OK"],
      });
      return;
    }

    // if no error, then render home page
    history.replace("/product-list");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"></IonButtons>
          <IonTitle>Add New Product</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/add-product">ADD</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel position="fixed">Name</IonLabel>
          <IonInput onIonChange={(event: any) => setName(event.target.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Description</IonLabel>
          <IonTextarea
            onIonChange={(event: any) => setDescription(event.target.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Price</IonLabel>
          <IonInput
            onIonChange={(event: any) => setPrice(event.target.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Quantity</IonLabel>
          <IonInput
            onIonChange={(event: any) => setQuantity(event.target.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Category</IonLabel>
          <IonSelect
            value={category}
            placeholder="Select One"
            onIonChange={(e) => setCategory(e.detail.value)}
          >
            <IonSelectOption value="shirt">Shirt</IonSelectOption>
            <IonSelectOption value="pants">Pants</IonSelectOption>
            <IonSelectOption value="shoes">Shoes</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonContent>
      <IonFooter>
        <IonButton onClick={() => doAddProduct()}>SAVE</IonButton>
        <IonButton color="danger" onClick={() => history.goBack()}>
          CANCEL
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default AddProductPage;
