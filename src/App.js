import React, { Component } from 'react';
import './App.css';
import SinglePolygon from './components/SinglePolygon';
import SummaryPolygon from './components/SummaryPolygon';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cornerMap: [],
      ratingArray: []
    }
  }

  componentDidMount() {
  }


  render() {
    let ratingArray = [{ name: 'AB', rating: 2 }, { name: 'CD', rating: 2 }, { name: 'EF', rating: 3 },
    { name: 'GH', rating: 4 }, { name: 'HI', rating: 5 }, { name: 'JK', rating: 4 },
    { name: 'LM', rating: 1 }, { name: 'LM', rating: 1 }, { name: 'AB', rating: 2 }, { name: 'CD', rating: 2 }, { name: 'EF', rating: 3 },
    { name: 'GH', rating: 4 }, { name: 'HI', rating: 5 }, { name: 'JK', rating: 4 },
    { name: 'LM', rating: 1 }, { name: 'LM', rating: 1 }];
    let polygonStyles = {
      polygonSides: 16,
      width: 600
    }
    ratingArray = [{ name: 'AB', rating: 2 }, { name: 'HD', rating: 2 }, { name: 'EF', rating: 3 },
    { name: 'GH', rating: 4 }, { name: 'HI', rating: 5 }];
    polygonStyles = {
      polygonSides: 5,
      width: 500
    }
    return (
      /*<SinglePolygon
        ratingArray={ratingArray}
        polygonStyles={polygonStyles}
      />*/
      <SummaryPolygon
        polygonStyles={polygonStyles}
        ratingDimensions={['AB', 'CD', 'EF', 'GH', 'HI']}
      />
    );
  }
}

export default App;
