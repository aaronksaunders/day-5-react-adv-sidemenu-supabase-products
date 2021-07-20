import {
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
import { useHistory } from "react-router";
import "./Page.css";

import { supabase } from "../store/supabase";
import { useEffect, useState } from "react";

const HomePage: React.FC = () => {
  const history = useHistory();

  // used to render platform specific alerts
  const [present] = useIonAlert();

  const [userProfile, setUserProfile] = useState<any>({});

  // get user profile information
  useEffect(() => {
    const loadUserProfile = async () => {
      const userId = supabase.auth.user()?.id;

      // query profile table to get user information
      const { data, error } = await supabase
        .from("profiles")
        .select("first,last")
        .eq("id", userId);

      debugger;
      // get the user data
      setUserProfile(data !== null ? data[0] : null);
    };

    console.log("get user profile information...");
    loadUserProfile();
  }, []);

  const doLogout = async () => {
    const { error } = await supabase.auth.signOut();

    // error check for creating user...
    if (error) {
      present({
        header: "Error Logging Out",
        message: error?.message,
        buttons: ["OK"],
      });
      return;
    }

    // after logout, go back to login page
    history.replace("/auth/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>HOME PAGE</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonButton routerLink={"/detail"}>DETAIL PAGE</IonButton>

        {/* use supabase auth api to get current user, and
    render the json response */}
        <pre>{JSON.stringify(userProfile, null, 2)}</pre>

        <IonButton onClick={() => doLogout()}>SIGN OUT</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
