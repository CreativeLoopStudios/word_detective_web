import React from "react";

const FirebaseContext = React.createContext(null);

export const withFirebase = (Component) => (props) => (
    <FirebaseContext.Consumer>
        {(firebase) => {
            console.log(firebase)
            return <Component {...props} firebase={firebase} />;
        }}
    </FirebaseContext.Consumer>
);

export default FirebaseContext;
