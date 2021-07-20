import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router";

// import supabase client
import { supabase } from "../../store/supabase";

// START OF COMPONENT
const CreateAccountPage: React.FC = () => {
  // for routing between pages
  const history = useHistory();

  // variables from the page that are needed to create
  // the user
  const [first, setFirst] = useState();
  const [last, setLast] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // used to render platform specific alerts
  const [present] = useIonAlert();

  const doCreateAccount = async () => {
    // STEP 1 - CREATE USER
    // response contains, error, data, user, session
    // https://supabase.io/docs/reference/javascript/auth-signup#sign-up
    const response = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    // error check for creating user...
    if (response.error) {
      present({
        header: "Error Creating Account",
        message: response.error?.message,
        buttons: ["OK"],
      });
      return;
    }

    // STEP 2 - ADD USER INFO TO PROFILE
    // https://supabase.io/docs/reference/javascript/upsert
    const { data, error } = await supabase.from("profiles").upsert({
      id: response.user?.id,
      first,
      last,
      updated_at: new Date(),
      username: email,
    });

    // error check for adding user profile...
    if (error) {
      present({
        header: "Error Creating Account",
        message: error?.message,
        buttons: ["OK"],
      });
      return;
    }

    // if no error, then render home page
    history.replace("/home");
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>CREATE ACCOUNT</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel position="fixed">First</IonLabel>
          <IonInput
            onIonChange={(event: any) => setFirst(event.target.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Last</IonLabel>
          <IonInput onIonChange={(event: any) => setLast(event.target.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">email</IonLabel>
          <IonInput
            onIonChange={(event: any) => setEmail(event.target.value)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">password</IonLabel>
          <IonInput
            type="password"
            onIonChange={(event: any) => setPassword(event.target.value)}
          />
        </IonItem>
        <IonButton onClick={() => doCreateAccount()}>CREATE ACCOUNT</IonButton>
        <IonButton routerLink={"/auth/login"}>CANCEL</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CreateAccountPage;
