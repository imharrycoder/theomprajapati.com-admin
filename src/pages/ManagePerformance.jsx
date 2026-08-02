import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ManagePerformance() {
  const [config, setConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [trafficData, setTrafficData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [pageSpeed, setPageSpeed] = useState(null);
  
  const [loadingTraffic, setLoadingTraffic] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingPageSpeed, setLoadingPageSpeed] = useState(false);

  const [period, setPeriod] = useState('30days');
  const [device, setDevice] = useState('mobile');

  // Load config
  useEffect(() => {
    apiFetch('/admin/analytics/config')
      .then((res) => {
        setConfig(res);
        setLoadingConfig(false);
        if (res.configured) {
          fetchTrafficData(period);
          fetchSearchData(period);
        }
      })
      .catch(() => setLoadingConfig(false));
  }, []);

  // Run PageSpeed Insights on demand
  useEffect(() => {
    fetchPageSpeed(device);
  }, [device]);

  // Refetch traffic when period changes
  useEffect(() => {
    if (config?.configured) {
      fetchTrafficData(period);
      fetchSearchData(period);
    }
  }, [period]);

  const fetchTrafficData = (p) => {
    setLoadingTraffic(true);
    apiFetch(`/admin/analytics/traffic?period=${p}`)
      .then(setTrafficData)
      .catch(() => {})
      .finally(() => setLoadingTraffic(false));
  };

  const fetchSearchData = (p) => {
    setLoadingSearch(true);
    apiFetch(`/admin/analytics/search?period=${p}`)
      .then(setSearchData)
      .catch(() => {})
      .finally(() => setLoadingSearch(false));
  };

  const fetchPageSpeed = (strat) => {
    setLoadingPageSpeed(true);
    apiFetch(`/admin/analytics/pagespeed?strategy=${strat}`)
      .then(setPageSpeed)
      .catch(() => {})
      .finally(() => setLoadingPageSpeed(false));
  };

  if (loadingConfig) {
    return <div className="text-gray-500">Loading performance data...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reach & Performance</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor your website's traffic, search visibility, and load speed.
        </p>
      </div>

      {/* PageSpeed Insights Section (Always available) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Live PageSpeed Insights</h3>
          <div className="flex gap-2 rounded-md bg-gray-100 p-1">
            <button
              onClick={() => setDevice('mobile')}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                device === 'mobile' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mobile
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                device === 'desktop' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Desktop
            </button>
          </div>
        </div>

        {loadingPageSpeed ? (
          <div className="flex h-32 items-center justify-center text-sm text-gray-500">
            Running Lighthouse audit (this takes about 10-15 seconds)...
          </div>
        ) : pageSpeed ? (
          <div>
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ScoreCircle label="Performance" score={pageSpeed.scores.performance} />
              <ScoreCircle label="Accessibility" score={pageSpeed.scores.accessibility} />
              <ScoreCircle label="Best Practices" score={pageSpeed.scores.bestPractices} />
              <ScoreCircle label="SEO" score={pageSpeed.scores.seo} />
            </div>
            <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-5">
              <MetricItem label="First Contentful Paint" value={pageSpeed.metrics.fcp} />
              <MetricItem label="Largest Contentful Paint" value={pageSpeed.metrics.lcp} />
              <MetricItem label="Cumulative Layout Shift" value={pageSpeed.metrics.cls} />
              <MetricItem label="Time to Interactive" value={pageSpeed.metrics.tti} />
              <MetricItem label="Speed Index" value={pageSpeed.metrics.speedIndex} />
            </div>
          </div>
        ) : (
          <div className="text-sm text-red-500">Failed to load PageSpeed Insights.</div>
        )}
      </div>

      {/* Traffic & Search Configuration Warning */}
      {!config?.configured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-bold text-amber-900">Traffic Data Setup Required</h3>
          <p className="mb-4 text-sm text-amber-800">
            To view live Google Analytics and Search Console data here, you need to configure a Google Cloud Service Account.
          </p>
          <div className="prose prose-sm prose-amber max-w-none">
            <ol className="list-decimal pl-4 space-y-2">
              <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">Google Cloud Console</a>.</li>
              <li>Create a new project (or use an existing one).</li>
              <li>Enable the <strong>Google Analytics Data API</strong> and <strong>Google Search Console API</strong>.</li>
              <li>Go to IAM & Admin &gt; Service Accounts. Create a new Service Account.</li>
              <li>Create and download a new JSON key for this Service Account.</li>
              <li>Add the Service Account email as a "Viewer" in your Google Analytics Property and as a "Restricted User" in Google Search Console.</li>
              <li>Stringify the JSON key and save it in your backend <code>.env</code> file as <code>GOOGLE_APPLICATION_CREDENTIALS_JSON='{"{...}"}'</code>.</li>
              <li>Add <code>GA_PROPERTY_ID="your-ga4-property-id"</code> to your backend <code>.env</code>.</li>
              <li>Restart your backend server.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Charts (Only shown if configured) */}
      {config?.configured && (
        <>
          <div className="flex justify-end">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Google Analytics */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Traffic (Google Analytics)</h3>
              
              {loadingTraffic ? (
                <div className="flex h-64 items-center justify-center text-sm text-gray-500">Loading...</div>
              ) : trafficData && !trafficData.error ? (
                <>
                  <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <MetricItem label="Users" value={trafficData.metrics.activeUsers} highlight />
                    <MetricItem label="Page Views" value={trafficData.metrics.pageViews} highlight />
                    <MetricItem label="Bounce Rate" value={trafficData.metrics.bounceRate} />
                    <MetricItem label="Avg Session" value={trafficData.metrics.avgSessionDuration} />
                  </div>
                  <div className="h-64">
                    <Line
                      data={trafficData.chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        plugins: { legend: { position: 'top', labels: { color: '#374151' } } },
                        scales: { 
                          x: { ticks: { color: '#6B7280' }, grid: { color: '#F3F4F6' } },
                          y: { beginAtZero: true, ticks: { color: '#6B7280' }, grid: { color: '#F3F4F6' } } 
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-sm text-red-500">Failed to load analytics data: {trafficData?.error || 'Unknown error'}</div>
              )}
            </div>

            {/* Search Console */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-gray-900">Search (Search Console)</h3>
              
              {loadingSearch ? (
                <div className="flex h-64 items-center justify-center text-sm text-gray-500">Loading...</div>
              ) : searchData && !searchData.error ? (
                <>
                  <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <MetricItem label="Total Clicks" value={searchData.metrics.clicks} highlight />
                    <MetricItem label="Impressions" value={searchData.metrics.impressions} highlight />
                    <MetricItem label="Avg CTR" value={searchData.metrics.ctr} />
                    <MetricItem label="Avg Position" value={searchData.metrics.position} />
                  </div>
                  <div className="h-64">
                    <Line
                      data={searchData.chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        interaction: { mode: 'index', intersect: false },
                        plugins: { legend: { position: 'top', labels: { color: '#374151' } } },
                        scales: { 
                          x: { ticks: { color: '#6B7280' }, grid: { color: '#F3F4F6' } },
                          y: { beginAtZero: true, ticks: { color: '#6B7280' }, grid: { color: '#F3F4F6' } } 
                        },
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-sm text-red-500">Failed to load search data: {searchData?.error || 'Unknown error'}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Helper components
function ScoreCircle({ label, score }) {
  let color = 'text-green-500 border-green-500 bg-green-50';
  if (score < 90) color = 'text-amber-500 border-amber-500 bg-amber-50';
  if (score < 50) color = 'text-red-500 border-red-500 bg-red-50';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`grid h-16 w-16 place-items-center rounded-full border-4 text-xl font-bold ${color}`}>
        {score}
      </div>
      <span className="text-center text-xs font-medium text-gray-600">{label}</span>
    </div>
  );
}

function MetricItem({ label, value, highlight }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-sm ${highlight ? 'font-bold text-indigo-600' : 'font-semibold text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

export default ManagePerformance;
