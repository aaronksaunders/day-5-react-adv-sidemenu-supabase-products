import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { supabase } from "../../store/supabase";

const ProductDetailPage: React.FC = () => {
  const params = useParams<any>();
  // used to render platform specific alerts

  const [present] = useIonAlert();
  const [product, setProduct] = useState<any>();

  const loadProductData = async () => {
    let { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.productId);

    // error check for creating user...
    if (error) {
      present({
        header: "Error Loading Product",
        message: error?.message,
        buttons: ["OK"],
      });
      return;
    }

    setProduct(data !== null ? data[0] : null);
  };

  useEffect(() => {
    loadProductData();
  }, [params.productId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{product?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <pre>{JSON.stringify(product, null, 2)}</pre>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;
