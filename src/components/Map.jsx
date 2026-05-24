import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

const Map = ({ onSelectProvince, provinces, playerNation, selectedProvinceId, attackMode }) => {
  const svgRef = useRef();
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(data => {
        setMapData(feature(data, data.objects.countries));
        setLoading(false);
      });
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

    // Grid lines for "Strategic" look
    const g = svg.append('g');

    const graticule = d3.geoGraticule();
    g.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#ffffff05')
      .attr('stroke-width', 0.5);

    const zoom = d3.zoom()
      .scaleExtent([1, 15])
      .on('zoom', (event) => g.attr('transform', event.transform));

    svg.call(zoom);

    const provincesGroup = g.append('g');

    provincesGroup.selectAll('path')
      .data(mapData.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('class', 'province')
      .attr('fill', d => {
        const province = provinces[d.id];
        if (province) {
          if (province.owner === playerNation) return '#2563eb'; // Bright Blue
          if (province.owner === 'Neutral') return '#0f172a'; // Deep Navy
          return '#dc2626'; // Red
        }
        return '#0f172a';
      })
      .attr('stroke', d => {
        if (d.id === selectedProvinceId) return '#fbbf24';
        if (attackMode.active && d.id === attackMode.fromId) return '#f97316';
        return '#1e293b';
      })
      .attr('stroke-width', d => d.id === selectedProvinceId ? 2.5 : 0.5)
      .on('click', (event, d) => {
        onSelectProvince({ id: d.id, name: d.properties.name });
      });

    // Pulse effect for player provinces
    provincesGroup.selectAll('.player-pulse')
      .data(mapData.features.filter(d => provinces[d.id]?.owner === playerNation))
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1)
      .attr('class', 'animate-pulse-blue pointer-events-none');

  }, [mapData, provinces, playerNation, selectedProvinceId, attackMode, onSelectProvince]);

  return (
    <div className="w-full h-full bg-[#020617] relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-50">
          <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-blue-400 font-black tracking-[0.3em] uppercase animate-pulse">Establishing Satellite Link...</p>
        </div>
      )}
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default Map;
