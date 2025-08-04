import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { ConfigModule } from '../../shared/moduleconfig/config.module';
import { httpInterceptorProviders } from '../../token.interceptor';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ConfigModule.forRoot({ apiEndpoint: environment.SERVER_API_URL }),
      ],
      providers: [{ provide: HttpClient }, httpInterceptorProviders],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of products', (done: DoneFn) => {
    const products = service.getAllProducts().subscribe((product) => {
      expect(Array.isArray(products)).toBe(true);
    });
    done();
  });

  it('should return Bier', (done: DoneFn) => {
    service.getProductById('12345-123-17').subscribe((product) => {
      expect(product!.name).toBe('Bier');
    });
    done();
  });

  it('should add a product', (done: DoneFn) => {
    const newProduct = {
      id: '12345-123-20',
      name: 'Aardbei',
      allergies: [],
      containsAlcohol: false,
    };
    service.addProduct(newProduct);
    const products = service.getAllProducts().subscribe((product) => {
      expect(products).toContain(newProduct);
    });
    done();
  });

  it('should update a product', (done: DoneFn) => {
    const updatedProduct = {
      id: '12345-123-11',
      name: 'Banaan',
      allergies: [],
      containsAlcohol: false,
    };
    service.updateProduct(updatedProduct);
    service.getProductById('12345-123-11').subscribe((product) => {
      expect(product!.name).toBe('Banaan');
    });
    done();
  });

  it('should delete a product', (done: DoneFn) => {
    const deletedProductId = '12345-123-18';
    service.deleteProduct(deletedProductId);
    service.getProductById(deletedProductId).subscribe((product) => {
      expect(product).toBeNull();
    });
    done();
  });
});
