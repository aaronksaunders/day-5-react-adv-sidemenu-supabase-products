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
import { useParams } from "react-router";
import "./Page.css";

const DetailPage: React.FC = () => {
  const [present] = useIonAlert();

  const doShowAlert = () => {
    present({
      header: "Alert Header",
      message: "alert message from hook",
      buttons: [
        "Cancel",
        { text: "Ok", handler: (d) => console.log("ok pressed") },
        { text: "Ok Again", handler: (d) => console.log("ok again pressed") },
      ],
      onDidDismiss: (e) => console.log("did dismiss"),
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Detail PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonButton onClick={() => doShowAlert()}>Show Alert</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DetailPage;
