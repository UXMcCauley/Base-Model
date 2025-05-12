// src/app/configuration/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ConfigurationPage() {
  const urlPatterns = [
    '{{base_url}}/api/1.0/full_metadata.php/{object_name}',
 'Custom URL',
    '{{base_url}}/api/1.0/index.php/skill/all',
  ];

  const [selectedUrlPattern, setSelectedUrlPattern] = useState(urlPatterns[0]);
  const [baseUrl, setBaseUrl] = useState('');
  const [objectName, setObjectName] = useState('');
  const [assembledUrl, setAssembledUrl] = useState('');
  const [accessToken, setAccessToken] = useState(''); // State for access token for demonstration
  const [apiData, setApiData] = useState<any>(null); // State to store API data

  useEffect(() => {
    let url;
    if (selectedUrlPattern === 'Custom URL') {
      url = baseUrl;
    } else {
 url = selectedUrlPattern.replace('{{base_url}}', baseUrl);
 url = url.replace('{object_name}', objectName);
    }
    setAssembledUrl(url);
  }, [selectedUrlPattern, baseUrl, objectName]);

  const handleUrlPatternChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUrlPattern(event.target.value);
    setObjectName(''); // Clear object name when a new URL pattern is selected
  };

  const handleConnect = async () => {
    // Here you would implement your API call logic
    console.log("NOTE: In a real application, retrieve the access token securely, e.g., from a state management solution or a secure storage mechanism.");
    console.log('Attempting to connect to:', assembledUrl);

    try {
      const response = await fetch(assembledUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        // Add other options like method, body, etc. as needed
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedData = await response.json();
      setApiData(fetchedData);
      // Handle the API response

      // Send the fetched data to the server-side endpoint
      const storeDataResponse = await fetch('/api/store-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fetchedData),
      });

      if (!storeDataResponse.ok) { throw new Error(`Error storing data: ${storeDataResponse.status}`); }
    } catch (error) {
      console.error('Error connecting to API:', error);
      // Handle errors
    }
  };

  useEffect(() => {
    if (apiData) {
      console.log('Successfully fetched API data:', apiData);
    }
  }, [apiData]);
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Configuration</h1>

        <div className="mb-4">
          <label htmlFor="urlPattern" className="block text-sm font-medium text-gray-300 mb-2">Select URL Pattern:</label>
          <select
            id="urlPattern"
            value={selectedUrlPattern}
            onChange={handleUrlPatternChange}
            className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-100"
          >
            {urlPatterns.map((pattern) => (
              <option key={pattern} value={pattern}>
                {pattern}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-300 mb-2">Base URL:</label>
          <input
            type="text"
            id="baseUrl"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-100"
            placeholder="e.g., https://your-api-domain.com"
          />
        </div>

        {selectedUrlPattern.includes('{object_name}') && (
           <div className="mb-4">
            <label htmlFor="objectName" className="block text-sm font-medium text-gray-300 mb-2">Object Name:</label>
            <input
              type="text"
              id="objectName"
              value={objectName}
              onChange={(e) => setObjectName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-100"
              placeholder="e.g., some_object_id"
            />
          </div>
        )}

         <div className="mb-4">
          <label htmlFor="accessToken" className="block text-sm font-medium text-gray-300 mb-2">Access Token:</label>
          <input
            type="text"
            id="accessToken"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-100"
            placeholder="Enter your API access token"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Assembled URL:</h2>
          <p className="p-3 border border-gray-700 bg-gray-800 rounded-md break-all text-gray-300">{assembledUrl}</p>
        </div>

        <button
          onClick={handleConnect}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Connect
        </button>

        <div className="mt-8">
          <Link href="/">
            <p className="text-blue-400 hover:underline">Back to Chat</p>
          </Link>
        </div>
      </div>
    </div>
  );
}