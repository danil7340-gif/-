import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { ZoomIn, ZoomOut, Maximize, Target } from 'lucide-react';

const Map = ({ onSelectProvince, provinces, playerNation, selectedProvinceId, attackMode }) => {
  const svgRef = useRef();
  const gRef = useRef();
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const zoomRef = useRef();

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(data => {
        setMapData(feature(data, data.objects.countries));
        setLoading(false);
      });
  }, []);

  const handleZoom = useCallback((direction) => {
    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;
    if (!zoom) return;

    svg.transition()
      .duration(300)
      .call(zoom.scaleBy, direction === 'in' ? 1.5 : 0.6);
  }, []);

  const handleReset = useCallback(() => {
    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;
    if (!zoom) return;

    svg.transition()
      .duration(500)
      .call(zoom.transform, d3.zoomIdentity);
  }, []);

  useEffect(() => {
    if (!mapData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const projection = d3.geoMercator()
      .scale(width / 2.5 / Math.PI)
      .translate([width / 2, height / 1.4]);

    const path = d3.geoPath().projection(projection);

    svg.selectAll('*').remove();

    const g = svg.append('g');
    gRef.current = g;

    // Grid lines
    const graticule = d3.geoGraticule();
    g.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path);

    const zoom = d3.zoom()
      .scaleExtent([0.8, 20])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        // Scale stroke width to maintain visible borders
        g.selectAll('.province').attr('stroke-width', 0.5 / event.transform.k);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    const provincesGroup = g.append('g');

    provincesGroup.selectAll('path')
      .data(mapData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'province cursor-pointer')
      .attr('fill', d => {
        const province = provinces[d.id];
        if (province) {
          if (province.owner === playerNation) return '#2563eb';
          if (province.owner === 'Neutral') return '#0f172a';
          return '#dc2626';
        }
        return '#0f172a';
      })
      .attr('stroke', d => d.id === selectedProvinceId ? '#fbbf24' : '#1e293b')
      .attr('stroke-width', 0.5)
      .on('click', (event, d) => {
        onSelectProvince({ id: d.id, name: d.properties.name });
      });

    // Selection highlight
    if (selectedProvinceId) {
      provincesGroup.selectAll('path')
        .filter(d => d.id === selectedProvinceId)
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 2)
        .raise();
    }

  }, [mapData, provinces, playerNation, selectedProvinceId, onSelectProvince]);

  return (
    <div className="w-full h-full bg-[#020617] relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-50">
          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-blue-400 font-black tracking-[0.3em] uppercase animate-pulse">Initializing Interface...</p>
        </div>
      )}
      <svg ref={svgRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute bottom-10 right-10 flex flex-col space-y-2 pointer-events-auto">
        <button onClick={() => handleZoom('in')} className="p-3 glass-panel rounded-xl hover:bg-slate-800 transition-all text-white shadow-xl">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => handleZoom('out')} className="p-3 glass-panel rounded-xl hover:bg-slate-800 transition-all text-white shadow-xl">
          <ZoomOut size={20} />
        </button>
        <button onClick={handleReset} className="p-3 glass-panel rounded-xl hover:bg-slate-800 transition-all text-white shadow-xl">
          <Maximize size={20} />
        </button>
      </div>
    </div>
  );
};

export default Map;
