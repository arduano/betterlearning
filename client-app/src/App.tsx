import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Scroller } from './scroller/Scroller';
import { Main } from './main/Main';

class App extends React.Component<{}, { rotate: number }> {

  constructor(props: Readonly<{}>) {
    super(props);
  }
  
  componentWillUnmount() {
    
  }

  render() {
    return (
      <div className="App">
        <Main></Main>
      </div>
    );
  }

  pushRotation() {
    
  }
}

export default App;
