import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  IonSplitPane,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Page from "./pages/Page";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/auth/LoginPage";
import CreateAccountPage from "./pages/auth/CreateAccountPage";
import { useEffect, useState } from "react";
import { supabase } from "./store/supabase";
import ProductPage from "./pages/products/ProductPage";
import AddProductPage from "./pages/products/AddProductPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";

const App: React.FC = () => {
  const [loading, setLoading] = useState<any>(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(supabase.auth.session());
    setLoading(false);

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    console.log("session", supabase.auth.session());
  }, []);

  // if we have't checked for session yet, then display loading screen
  if (loading)
    return (
      <IonApp>
        <IonLoading isOpen={loading} />
      </IonApp>
    );

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/home" />
            </Route>

            {/* PRIVATE ROUTES */}
            <PrivateRoute path="/page/:name" exact={true} component={Page} />
            <PrivateRoute path="/home" exact={true} component={HomePage} />
            <PrivateRoute path="/detail" exact={true} component={DetailPage} />
            <PrivateRoute
              path="/product-list"
              exact={true}
              component={ProductPage}
            />

            <PrivateRoute
              path="/add-product"
              exact={true}
              component={AddProductPage}
            />

            <PrivateRoute
              path="/product-detail/:productId"
              exact={true}
              component={ProductDetailPage}
            />

            {/* PUBLIC ROUTES */}
            <Route path="/auth/login" exact={true}>
              <LoginPage />
            </Route>
            <Route path="/auth/create-account" exact={true}>
              <CreateAccountPage />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

/**
 *
 * @param param0
 * @returns
 */
const PrivateRoute = ({ component: Component, ...rest }: any) => {
  // auth.session to get the current user's auth state
  const isAuth = supabase.auth.session() !== null;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? <Component {...props} /> : <Redirect to="/auth/login" />
      }
    />
  );
};
