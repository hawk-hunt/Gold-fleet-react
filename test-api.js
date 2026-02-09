// Test API endpoints
const API_BASE = 'http://localhost:8000/api';

async function test() {
  try {
    console.log('1. Testing POST /api/login...');
    const loginRes = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@demo.com', password: 'password' })
    });
    
    const loginData = await loginRes.json();
    console.log('Login Status:', loginRes.status);
    console.log('Login Response:', JSON.stringify(loginData, null, 2));
    
    if (!loginData.token) {
      console.error('No token received!');
      return;
    }
    
    const token = loginData.token;
    console.log('\n2. Testing POST /api/vehicles with token...');
    
    const vehicleRes = await fetch(`${API_BASE}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Test Vehicle',
        license_plate: 'TEST-123',
        type: 'Car',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        vin: 'VIN123',
        status: 'active',
        fuel_type: 'gasoline'
      })
    });
    
    const vehicleData = await vehicleRes.json();
    console.log('Vehicle Status:', vehicleRes.status);
    console.log('Vehicle Response:', JSON.stringify(vehicleData, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
