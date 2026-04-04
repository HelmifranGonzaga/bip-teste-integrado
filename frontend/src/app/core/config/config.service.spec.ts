import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService, AppConfig } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpMock: HttpTestingController;

  const mockConfig: AppConfig = {
    apiUrl: 'http://localhost:8082/api/v1',
    version: '0.0.1',
    environment: 'development'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService]
    });

    service = TestBed.inject(ConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load config from /assets/config.json', (done) => {
    service.getConfig().subscribe((config) => {
      expect(config).toEqual(mockConfig);
      expect(config.apiUrl).toBe('http://localhost:8082/api/v1');
      done();
    });

    const req = httpMock.expectOne('/assets/config.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockConfig);
  });

  it('should cache config with shareReplay (only one request)', (done) => {
    let callCount = 0;

    // First subscription
    service.getConfig().subscribe(() => {
      callCount++;
    });

    // Second subscription (should use cache)
    service.getConfig().subscribe(() => {
      callCount++;
    });

    // Third subscription (should use cache)
    service.getConfig().subscribe(() => {
      callCount++;

      // All three subscriptions completed, but only one HTTP request made
      expect(callCount).toBe(3);
      done();
    });

    // Only one HTTP request should be made despite three subscriptions
    const req = httpMock.expectOne('/assets/config.json');
    req.flush(mockConfig);
  });

  it('should return default config synchronously from getApiUrl()', () => {
    const apiUrl = service.getApiUrl();
    expect(apiUrl).toBe('http://localhost:8082/api/v1');
  });

  it('should handle config with all optional fields', (done) => {
    const fullConfig: AppConfig = {
      apiUrl: 'http://prod.example.com/api/v2',
      apiBaseUrl: 'http://prod.example.com',
      version: '1.0.0',
      environment: 'production'
    };

    service.getConfig().subscribe((config) => {
      expect(config.apiBaseUrl).toBe('http://prod.example.com');
      expect(config.environment).toBe('production');
      done();
    });

    const req = httpMock.expectOne('/assets/config.json');
    req.flush(fullConfig);
  });

  it('should use default config on HTTP error', (done) => {
    const DEFAULT_CONFIG = {
      apiUrl: 'http://localhost:8082/api/v1',
      version: '0.0.1',
      environment: 'production'
    };

    service.getConfig().subscribe(
      (config) => {
        // Should receive default config instead of erroring
        expect(config).toEqual(DEFAULT_CONFIG);
        done();
      },
      () => {
        // Should never error - catchError returns default config
        fail('should not error - should return default config instead');
      }
    );

    const req = httpMock.expectOne('/assets/config.json');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  }, 10000); // Increase timeout for this test

  it('should correctly parse environment types', (done) => {
    const devConfig: AppConfig = {
      apiUrl: 'http://localhost:8082/api/v1',
      version: '0.0.1',
      environment: 'development'
    };

    service.getConfig().subscribe((config) => {
      expect(config.environment).toMatch(/development|production/);
      done();
    });

    const req = httpMock.expectOne('/assets/config.json');
    req.flush(devConfig);
  });
});
