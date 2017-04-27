import React, { Component } from 'react';
import PropTypes from 'prop-types';

const getRandomRating = () => {
    return [
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5) + 1,
        Math.floor(Math.random() * 5) + 1,
    ];
}

const getQuadrantAdjustmentStyle = (x, y, canvasSize, color) => {
    if (x > 0 && y > 0) {
        return { left: x + canvasSize, top: canvasSize + y };
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

export default class SummaryPolygon extends Component {
    constructor(props) {
        super(props);
        this.drawShape = this.drawShape.bind(this);
        this.drawPolygon = this.drawPolygon.bind(this);
        this.drawRatings = this.drawRatings.bind(this);
        this.drawSpider = this.drawSpider.bind(this);
        this.state = {
            cornerMap: [],
            drawingDefaults: {
                polygonSides: 5,
                width: 300,
                colorOverlay: "#2ECC71",
                colorStroke: "#E8E5DF",
                ratingLimit: 5
            },
            ratingDimensions: this.props.ratingDimensions
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
        ratingDimensions: PropTypes.array.isRequired
    };

    drawPolygon(context, polyAngle, radius, polygonSides, colorStroke, canvasSize) {
        let cornerMap = [];
        context.beginPath();
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
            var calculatedRad = (ratingsArr[n] * radIncr);
            context.lineTo(calculatedRad * Math.cos(polyAngle * n), calculatedRad * Math.sin(polyAngle * n));
        }
        context.closePath();
        context.fillStyle = fillStyle;
        context.fill();
    }

    drawSpider(context, radius, polyAngle, polygonSides) {
        for (var n = 0; n < polygonSides; n++) {
            const xCoord = radius * Math.cos(polyAngle * n);
            const yCoord = radius * Math.sin(polyAngle * n)
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(xCoord, yCoord);
            context.stroke();
        }
    }

    drawShape(canvas, tempCanvas) {
        const { drawingDefaults } = this.state;

        const { polygonStyles, ratingDimensions } = this.props;
        const drawingStyles = { ...drawingDefaults, ...polygonStyles };
        this.setState({ drawingDefaults: drawingStyles });

        const context = canvas.getContext('2d');
        const polyAngle = (Math.PI * 2) / drawingStyles.polygonSides;
        const radius = (drawingStyles.width - 100) / 2;
        context.translate(canvas.width / 2, canvas.height / 2);
        const tempContext = tempCanvas.getContext('2d');
        tempContext.translate(canvas.width / 2, canvas.height / 2);
        context.strokeStyle = drawingStyles.colorStroke;

        const cornerMap = this.drawPolygon(context, polyAngle, radius,
            drawingStyles.polygonSides, drawingStyles.strokeStyle, canvas.width);
        for (let i = 1; i < drawingStyles.polygonSides; i++) {
            this.drawPolygon(context, polyAngle, radius - (radius / drawingStyles.ratingLimit * i),
                drawingStyles.polygonSides, drawingStyles.strokeStyle, canvas.width);
        }
        this.drawPolygon(context, polyAngle, 5,
            drawingStyles.polygonSides, drawingStyles.strokeStyle, canvas.width);

        this.drawSpider(context, radius, polyAngle, drawingStyles.polygonSides);

        const opacityTable = [1, 0.9558, 0.9079, 0.8569, 0.8036, 0.7487, 0.6928, 0.6367,
            0.5810, 0.5266, 0.474, 0.4239, 0.3772, 0.3344, 0.2962, 0.2634, 0.2367, 0.2168, 0.2043, 0.2];
        const ratings = [];
        for (var n = 0; n < 16; n++) {
            var rating = getRandomRating();
            ratings.push(rating);
        }
        let opacityVal;
        if (ratings.length < 20) {
            opacityVal = opacityTable[ratings.length];
        } else {
            opacityVal = opacityTable[19];
        }
        for (let n = 0; n < ratings.length; n++) {
            var ratingsArr = ratings[n];
            this.drawRatings(tempContext, ratingsArr, radius / drawingStyles.ratingLimit, polyAngle,
                drawingStyles.colorOverlay, opacityVal);
            tempContext.blendOnto(context, 'multiply');
            tempContext.clearRect(-tempCanvas.width / 2, -tempCanvas.height / 2, tempCanvas.width, tempCanvas.height);
        }

        return cornerMap;
    }

    componentDidMount() {
        const canvasElm = document.getElementById('canvas');
        const tempCanvasElm = document.getElementById('temp-canvas');
        const { ratingDimensions, polygonStyles } = this.props;
        canvasElm.getContext("2d").clearRect(0, 0, polygonStyles.width, polygonStyles.width);
        const cornerMap = this.drawShape(canvasElm, tempCanvasElm);
        this.setState({ cornerMap });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ ratingArray: newProps.ratingArray });
        const canvasElm = document.getElementById('canvas');
        const tempCanvasElm = document.getElementById('temp-canvas');
        const { ratingDimensions, polygonStyles } = newProps;
        canvasElm.getContext("2d").clearRect(0, 0, polygonStyles.width, polygonStyles.width);
        const cornerMap = this.drawShape(canvasElm, tempCanvasElm);
        this.setState({ cornerMap });
    }

    render() {
        const { ratingDimensions, cornerMap } = this.state;
        const { polygonStyles } = this.props;
        console.log(cornerMap);
        const cornerTitles = cornerMap.map((item, key) => {
            const styles = { ...item, position: 'absolute', transform: 'rotate(90deg)' };
            return <span key={key} style={styles}>{ratingDimensions[key]}</span >;
        });
        return (
            <div className="App" style={{
                position: 'relative', width: polygonStyles.width,
                height: polygonStyles.width,
                transform: 'rotate(-90deg)'
            }}>
                {cornerTitles}
                <canvas id="canvas" height={polygonStyles.width} width={polygonStyles.width}></canvas>
                <canvas id="temp-canvas" height={polygonStyles.width} width={polygonStyles.width} style={{ display: 'block' }}></canvas>
            </div>
        );
    }
}