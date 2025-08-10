import http from 'k6/http';
import { check } from 'k6';

// Konfigurasi load test
export const options = {
    vus: 100, // 100 Virtual Users
    duration: '30s', // durasi pengujian
};

export default function () {
    const res = http.get('http://localhost:3000/api/v1');

    check(res, {
        'status 200': (r) => r.status === 200,
        'response < 100ms': (r) => r.timings.duration < 100,
    });
}
