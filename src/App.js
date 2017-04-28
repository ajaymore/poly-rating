import React, { Component } from 'react';
import './App.css';
import SinglePolygon from './node_modules/components/SinglePolygon';
import SummaryPolygon from './node_modules/components/SummaryPolygon';
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
    // let ratingArray = [{ name: 'AB', rating: 2 }, { name: 'CD', rating: 2 }, { name: 'EF', rating: 3 },
    // { name: 'GH', rating: 4 }, { name: 'HI', rating: 5 }, { name: 'JK', rating: 4 },
    // { name: 'LM', rating: 1 }, { name: 'LM', rating: 1 }, { name: 'AB', rating: 2 }, { name: 'CD', rating: 2 }, { name: 'EF', rating: 3 },
    // { name: 'GH', rating: 4 }, { name: 'HI', rating: 5 }, { name: 'JK', rating: 4 },
    // { name: 'LM', rating: 1 }, { name: 'LM', rating: 1 }];
    // let polygonStyles = {
    //   polygonSides: 16,
    //   width: 600
    // }
    const ratingArray = [{ name: 'AB', rating: 2 }, { name: 'CD', rating: 2 }, { name: 'EF', rating: 3 },
    { name: 'GH', rating: 4 }, { name: 'HI', rating: 5 }];
    const polygonStyles = {
      polygonSides: 5,
      width: 500
    }
    return (
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center' }}>Polygon Rating App</h2>
        <pre>
          <code>
            {"const ratingArray = [{ name: 'AB', rating: 2 }, { name: 'CD', rating: 2 },\n" +
              "\t{ name: 'EF', rating: 3 }, { name: 'GH', rating: 4 },\n" +
              "\t{ name: 'HI', rating: 5 }];\n\n\n" +
              "const polygonStyles = {\n" +
              "\tpolygonSides: 5,\n" +
              "\twidth: 500\n" +
              "}\n\n"}
          </code>
        </pre>
        <pre>
          <code>
            {'<SinglePolygon\n\tratingArray={ratingArray}\n\tpolygonStyles={polygonStyles}\n\tcanvasId="single-polygon"\n/>;'}
          </code>
        </pre>
        <SinglePolygon
          ratingArray={ratingArray}
          polygonStyles={polygonStyles}
          canvasId="single-polygon"
        />
        <pre>
          <code>
            {"<SummaryPolygon\n\tratingDimensions={['AB', 'CD', 'EF', 'GH', 'HI']}\n\t" +
              'polygonStyles={polygonStyles}\n\tcanvasId="summary-polygon"\n/>;'}
          </code>
        </pre>
        <SummaryPolygon
          polygonStyles={polygonStyles}
          ratingDimensions={['AB', 'CD', 'EF', 'GH', 'HI']}
          canvasId="summary-polygon"
        />
      </div>
    );
  }
}

export default App;
