import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getQuadrantAdjustmentStyle = (x, y, canvasSize, color) => {
    if (x > 0 && y > 0) {
        return { left: x + canvasSize, top: canvasSize + y, color };
    } else if (x > 0 && y < 0) {
        return { left: x + canvasSize, bottom: -y + canvasSize, color };
    } else if (x < 0 && y > 0) {
        return { right: -x + canvasSize, top: canvasSize + y, color };
    } else if (x < 0 && y < 0) {
        return { right: -x + canvasSize, bottom: -y + canvasSize, color };
    } else if (x > 0 && y === 0) {
        return { left: canvasSize + x, top: canvasSize + y, color }
    } else {
        return { left: x, top: y, color };
    }
}

export default class SinglePolygon extends Component {
    constructor(props) {
        super(props);
        this.drawShape = this.drawShape.bind(this);
        this.drawPolygon = this.drawPolygon.bind(this);
        this.drawRatings = this.drawRatings.bind(this);
        this.state = {
            cornerMap: [],
            ratingArray: this.props.ratingArray,
            drawingDefaults: {
                polygonSides: 5,
                width: 300,
                colorOverlay: "#2ECC71",
                colorStroke: "#E8E5DF",
                ratingLimit: 5
            }
        }
    }

    static propTypes = {
        polygonStyles: PropTypes.shape({
            polygonSides: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            colorOverlay: PropTypes.string,
            colorStroke: PropTypes.string,
            ratingLimit: PropTypes.number
        }).isRequired,
        ratingArray: PropTypes.array.isRequired
    };
    drawPolygon(context, polyAngle, radius, polygonSides, colorStroke, canvasSize) {
        let cornerMap = [];
        context.beginPath();
        // context.arc(0, 0, 1, 0, 2 * Math.PI);
        context.stroke();
        let previous = { x: radius, y: 0 };
        for (var n = 0; n < polygonSides; n++) {
            const xCoord = radius * Math.cos(polyAngle * n);
            const yCoord = radius * Math.sin(polyAngle * n)
            cornerMap.push(getQuadrantAdjustmentStyle(xCoord, yCoord, canvasSize / 2));
            context.beginPath();
            const { x, y } = previous;
            previous = { x: xCoord, y: yCoord };
            context.moveTo(x, y);
            context.lineTo(xCoord, yCoord);
            context.stroke();
        }
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(radius, 0);
        context.stroke();
        return cornerMap;
    }

    drawRatings(context, ratingsArr, radIncr, polyAngle, fillStyle, opacityVal) {
        context.globalAlpha = opacityVal;
        context.beginPath();
        for (var n = 0; n < ratingsArr.length; n++) {
            if (ratingsArr[n].rating > this.state.drawingDefaults.ratingLimit) {
                console.error(`Rating cannot be greater than ${this.props.polygonStyles.ratingLimit}`);
                return;
            }
            var calculatedRad = (ratingsArr[n].rating * radIncr);
            context.lineTo(calculatedRad * Math.cos(polyAngle * n), calculatedRad * Math.sin(polyAngle * n));
        }
        context.closePath();
        context.fillStyle = fillStyle;
        context.fill();
    };

    drawShape(canvas, ratingArray) {
        const { drawingDefaults } = this.state;

        const { polygonStyles } = this.props;
        const drawingStyles = { ...drawingDefaults, ...polygonStyles };
        this.setState({ drawingDefaults: drawingStyles });

        if (ratingArray.length !== drawingStyles.polygonSides) {
            console.error('Ratings array and number of polygon sides should be equal');
            return;
        }
        const context = canvas.getContext('2d');
        const polyAngle = (Math.PI * 2) / drawingStyles.polygonSides;
        const radius = (drawingStyles.width - 100) / 2;
        context.translate(canvas.width / 2, canvas.height / 2);
        // context.rotate(-Math.PI / 2);
        this.drawRatings(context, ratingArray, radius / drawingStyles.ratingLimit, polyAngle, drawingStyles.colorOverlay);
        return this.drawPolygon(context, polyAngle, radius, drawingStyles.polygonSides, drawingStyles.strokeStyle, canvas.width);
    }

    componentDidMount() {
        const canvasElm = document.getElementById('canvas');
        const { ratingArray, polygonStyles } = this.props;
        canvasElm.getContext("2d").clearRect(0, 0, polygonStyles.width, polygonStyles.width);
        const cornerMap = this.drawShape(canvasElm, ratingArray, polygonStyles);
        this.setState({ cornerMap });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ ratingArray: newProps.ratingArray });
        const canvasElm = document.getElementById('canvas');
        const { ratingArray, polygonStyles } = newProps;
        canvasElm.getContext("2d").clearRect(0, 0, polygonStyles.width, polygonStyles.width);
        const cornerMap = this.drawShape(canvasElm, ratingArray, polygonStyles);
        this.setState({ cornerMap });
    }

    render() {
        const { ratingArray, cornerMap } = this.state;
        const { polygonStyles } = this.props;
        const cornerTitles = cornerMap.map((item, key) => {
            const styles = { ...item, position: 'absolute', transform: 'rotate(90deg)' };
            return <span key={key} style={styles}>{ratingArray[key].name}</span >;
        });
        return (
            <div className="App" style={{
                position: 'relative', width: polygonStyles.width,
                height: polygonStyles.width,
                transform: 'rotate(-90deg)'
            }}>
                {cornerTitles}
                <canvas id="canvas" height={polygonStyles.width} width={polygonStyles.width}></canvas>
            </div>
        );
    }
}