'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Feature } from 'geojson';

export default function D3Graph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [geoData, setGeoData] = useState<any>(null);

  // Fetch GeoJSON data
  useEffect(() => {
    fetch('/data/bangladesh-districts.json') // Update path based on your public directory structure
      .then(response => response.json())
      .then(data => {
        setGeoData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching GeoJSON:', err);
        setError('Failed to load map data');
        setIsLoading(false);
      });
  }, []);

  // Create map when data is available
  useEffect(() => {
    if (!svgRef.current || !geoData) return;

    try {
      // Clear existing SVG content
      d3.select(svgRef.current).selectAll("*").remove();

      // Set up dimensions
      const width = 800;
      const height = 600;

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height].join(' '));

      // Create projection - Updated coordinates for GADM data
      const projection = d3.geoMercator()
        .center([90.3563, 23.6850])
        .scale(4000) // Increased scale for better visibility
        .translate([width / 2, height / 2]);

      // Create path generator
      const path = d3.geoPath().projection(projection);

      // Create a group for the map
      const g = svg.append('g');

      // Add zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom as any);

      // Draw map - Updated property access for GADM data
      g.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d: any) {
          d3.select(this)
            .attr('fill', '#34675C')
            .attr('stroke-width', 1);
          // Add tooltip with district name
          const districtName = d.properties.NAME_2;
          console.log('District:', districtName); // For debugging
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('fill', '#69b3a2')
            .attr('stroke-width', 0.5);
        })
        .append('title')
        .text((d: any) => `District: ${d.properties.NAME_2}`);

    } catch (err) {
      console.error('Error creating map:', err);
      setError(err instanceof Error ? err.message : 'Failed to create map');
    }
  }, [geoData]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Bangladesh Map with D3</h1>
        <div className="border rounded-lg p-4 bg-white">
          {isLoading ? (
            <div className="flex justify-center items-center h-[600px]">
              <div className="text-gray-500">Loading map...</div>
            </div>
          ) : (
            <svg 
              ref={svgRef}
              className="w-full h-full"
              style={{ maxWidth: '800px', margin: '0 auto' }}
            ></svg>
          )}
        </div>
      </div>
    </div>
  );
}