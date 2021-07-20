import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { supabase } from "../../store/supabase";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<any>([]);

  const loadProductData = async () => {
    let { data, error } = await supabase.from("products").select("*");
    setProducts(data);
  };

  useEffect(() => {
    loadProductData();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>ProductList</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/add-product">ADD</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {products.map((p: any) => {
          return (
            <IonItem key={p.id} routerLink={`/product-detail/${p.id}`}>
              <IonLabel>
                <h1> {p.name}</h1>
                <div>{p.description}</div>
                <div>
                  <span style={{ paddingRight: 10, color: "green" }}>
                    ${p.price}
                  </span>
                  <span>{p.quantity}</span>
                </div>
              </IonLabel>
            </IonItem>
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export default ProductPage;
