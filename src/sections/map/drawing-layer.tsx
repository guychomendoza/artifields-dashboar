import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useRef, useState, useEffect } from 'react';

export const DrawingLayer = ({
    drawingMode,
    lineColor,
    drawnLines,
    setDrawnLines,
    smoothingIterations,
}: {
    drawingMode: 'draw' | 'erase' | null;
    lineColor: string;
    drawnLines: L.Polyline[];
    setDrawnLines: React.Dispatch<React.SetStateAction<L.Polyline[]>>;
    smoothingIterations: number;
}) => {
    const map = useMap();
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLine, setCurrentLine] = useState<L.Polyline | null>(null);
    const [currentPoints, setCurrentPoints] = useState<L.LatLng[]>([]);
    const eraserCircleRef = useRef<L.Circle | null>(null);
    const eraserRadius = 5; // 5 pixels

    useEffect(() => {
        if (!map) return;

        // Create eraser circle
        const eraserCircle = L.circle([0, 0], {
            radius: 0,
            color: 'red',
            fillColor: 'rgba(255, 0, 0, 0.1)',
            fillOpacity: 0.3,
            weight: 1,
        }).addTo(map);
        eraserCircleRef.current = eraserCircle;

        const updateEraserCircle = (e: MouseEvent) => {
            if (drawingMode === 'erase') {
                const point = map.mouseEventToLatLng(e);
                eraserCircle.setLatLng(point);
                const pixelRadius = eraserRadius;
                const metersPerPixel =
                    (40075016.686 * Math.abs(Math.cos((point.lat * Math.PI) / 180))) /
                    2 ** (map.getZoom() + 8);
                const meterRadius = pixelRadius * metersPerPixel;
                eraserCircle.setRadius(meterRadius);
                eraserCircle.addTo(map);
            } else {
                eraserCircle.removeFrom(map);
            }
        };

        const handlePointerDown = (e: PointerEvent) => {
            if (!drawingMode) return;
            setIsDrawing(true);
            const point = map.mouseEventToLatLng(e as MouseEvent);

            if (drawingMode === 'draw') {
                const newLine = L.polyline([point], {
                    color: lineColor,
                    smoothFactor: 1,
                    // @ts-expect-error custom property
                    type: 'drawn',
                }).addTo(map);
                setCurrentLine(newLine);
                setCurrentPoints([point]);
            }

            map.dragging.disable();
        };

        const handlePointerMove = (e: PointerEvent) => {
            updateEraserCircle(e as MouseEvent);
            if (!isDrawing || !drawingMode) return;
            const point = map.mouseEventToLatLng(e as MouseEvent);

            if (drawingMode === 'draw' && currentLine) {
                setCurrentPoints((prev) => [...prev, point]);
                const smoothedPoints = smoothLine([...currentPoints, point], smoothingIterations);
                currentLine.setLatLngs(smoothedPoints);
            } else if (drawingMode === 'erase') {
                drawnLines.forEach((line) => {
                    // @ts-expect-error leaflet typings
                    const newLatLngs = line.getLatLngs().filter((latLng: L.LatLng) => {
                        const pxPoint = map.latLngToContainerPoint(latLng);
                        const eraserPoint = map.latLngToContainerPoint(point);
                        return pxPoint.distanceTo(eraserPoint) > eraserRadius;
                    });
                    if (newLatLngs.length < 2) {
                        map.removeLayer(line);
                        setDrawnLines((prev) => prev.filter((l) => l !== line));
                    } else {
                        // @ts-expect-error leaflet typings
                        line.setLatLngs(newLatLngs);
                    }
                });
            }
        };

        const handlePointerUp = () => {
            if (isDrawing && drawingMode === 'draw' && currentLine) {
                const smoothedPoints = smoothLine(currentPoints, smoothingIterations);
                currentLine.setLatLngs(smoothedPoints);
                setDrawnLines((prevLines) => [...prevLines, currentLine]);
                setCurrentLine(null);
                setCurrentPoints([]);
            }
            setIsDrawing(false);
            map.dragging.enable();
        };

        map.getContainer().addEventListener('pointerdown', handlePointerDown);
        map.getContainer().addEventListener('pointermove', handlePointerMove);
        map.getContainer().addEventListener('pointerup', handlePointerUp);
        map.getContainer().addEventListener('pointerleave', handlePointerUp);

        return () => {
            map.getContainer().removeEventListener('pointerdown', handlePointerDown);
            map.getContainer().removeEventListener('pointermove', handlePointerMove);
            map.getContainer().removeEventListener('pointerup', handlePointerUp);
            map.getContainer().removeEventListener('pointerleave', handlePointerUp);
            if (eraserCircleRef.current) {
                eraserCircleRef.current.removeFrom(map);
            }
        };
    }, [
        map,
        isDrawing,
        currentLine,
        lineColor,
        drawingMode,
        drawnLines,
        setDrawnLines,
        currentPoints,
        smoothingIterations,
    ]);

    return null;
};

function smoothLine(points: L.LatLng[], iterations: number = 1): L.LatLng[] {
    if (points.length < 3) return points;

    for (let i = 0; i < iterations; i += 1) {
        const newPoints: L.LatLng[] = [];
        newPoints.push(points[0]);

        for (let j = 0; j < points.length - 1; j += 1) {
            const p0 = points[j];
            const p1 = points[j + 1];

            const q = L.latLng(0.75 * p0.lat + 0.25 * p1.lat, 0.75 * p0.lng + 0.25 * p1.lng);
            const r = L.latLng(0.25 * p0.lat + 0.75 * p1.lat, 0.25 * p0.lng + 0.75 * p1.lng);

            newPoints.push(q);
            newPoints.push(r);
        }

        newPoints.push(points[points.length - 1]);
        points = newPoints;
    }

    return points;
}
