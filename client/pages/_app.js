import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = function App({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <Component {...pageProps} />
    </div>
  )
};

AppComponent.getInitialProps = async (appContext) => {
  //AppComponent getInitialProps
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  //Page Component getInitialProps
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data
  }
};

export default AppComponent;