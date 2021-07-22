import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  useIonAlert,
  IonFooter,
  IonTextarea,
  IonButton,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { supabase } from "../../store/supabase";

const ProductCommentsPage = () => {
  const params = useParams<any>();

  const [present] = useIonAlert();

  // hold the comments data after retrieved from database
  const [comments, setComments] = useState<any>();

  // holds the messageText when creating new commments
  const [messageText, setMessageText] = useState<any>();

  // function to load the comments from the database
  const loadProductComments = async () => {
    let { data, error } = await supabase
      .from("product_comments")
      .select("*")
      .eq("product_id", params.productId);

    // error check for creating user...
    if (error) {
      errorAlert("Error Loading Product Comments", error?.message);
      return;
    }

    setComments(data !== null ? data : null);
  };

  // called when the component mounts, this is dependent on the productId
  // so we pass it in as a dependency, so this code is called whenever the
  // productId value changes
  useEffect(() => {
    loadProductComments();
  }, [params.productId]);

  /**
   * helper function for rendering an alert
   * @param header
   * @param message
   * @returns
   */
  const errorAlert = (header: string, message: string) => {
    present({
      header,
      message,
      buttons: ["OK"],
    });
    return;
  };

  // SAVE THE COMMENT TO THE LIST - save the information to database and
  // reload the comments before you are done.
  const doSaveComment = async () => {
    const { data, error } = await supabase.from("product_comments").upsert({
      product_id: params.productId,
      message: messageText,
      user_id: supabase.auth.user()?.id,
      username: supabase.auth.user()?.email,
    });

    // error check for saving comment
    if (error) {
      errorAlert("Error Saving Product Comment", error?.message);
      return;
    }

    // clear out message
    setMessageText("");

    await loadProductComments();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>{params?.productName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {comments ? (
          comments?.map((c: any) => <CommentItem comment={c} key={c.id} />)
        ) : (
          <h2> NO COMMENTS YET</h2>
        )}
      </IonContent>
      <IonFooter style={{ padding: 10 }}>
        <IonTextarea
          rows={3}
          value={messageText}
          style={{ background: "lightGrey" }}
          onIonChange={(event: any) => setMessageText(event.target.value)}
        />
        <IonButton
          size="small"
          onClick={doSaveComment}
          disabled={messageText?.length < 10}
        >
          SEND
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default ProductCommentsPage;

/**
 * Simple helper functional component to render a comment entry
 * @param param0
 * @returns
 */
const CommentItem = ({ comment }: any) => {
  var formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(comment.inserted_at));
  return (
    <IonItem>
      <IonLabel>
        <div>{comment.message}</div>
        <p>{comment.username}</p>
        <p>{formatted}</p>
      </IonLabel>
    </IonItem>
  );
};
