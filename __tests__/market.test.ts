import { COMMODITY_MAP, parseDamHtml, toMarketPrices } from '../src/services/market';

describe('Market Service', () => {
  describe('parseDamHtml', () => {
    it('should extract commodity data from DAM HTML', () => {
      const html = `
        <span class="stockbox">
          <a>Aman-Fine</a>: &nbsp; 45.5 - 48.0 <span>▲</span>
        </span>
        <span class="stockbox">
          <a>Boro-Medium</a>: 42 - 44 <span>▼</span>
        </span>
      `;

      const result = parseDamHtml(html);

      expect(result.length).toBe(2);
      expect(result[0].nameEn).toBe('Aman-Fine');
      expect(result[0].minPrice).toBe(45.5);
      expect(result[0].maxPrice).toBe(48.0);
      expect(result[0].trend).toBe('up');
      expect(result[1].trend).toBe('down');
    });

    it('should handle stable trend when no arrow', () => {
      const html = `<span class="stockbox"><a>Test-Crop</a>: 10 - 12 <span> </span></span>`;
      const result = parseDamHtml(html);

      expect(result[0].trend).toBe('stable');
    });

    it('should only include items with valid numeric prices', () => {
      const html = `
        <span class="stockbox"><a>Valid</a>: 10 - 12 <span>▲</span></span>
        <span class="stockbox"><a>Invalid</a>: N/A - N/A <span>▲</span></span>
      `;
      const result = parseDamHtml(html);

      expect(result.length).toBe(1);
      expect(result[0].nameEn).toBe('Valid');
    });
  });

  describe('toMarketPrices', () => {
    it('should convert DAM commodities to MarketPrice format', () => {
      const commodities = [
        {
          nameEn: 'Aman-Fine',
          minPrice: 45,
          maxPrice: 48,
          trend: 'up' as const,
        },
      ];

      const result = toMarketPrices(commodities);

      expect(result.length).toBe(1);
      expect(result[0].commodity).toBe(COMMODITY_MAP['Aman-Fine'].bn);
      expect(result[0].unit).toBe('কেজি');
      expect(result[0].wholesale_price).toBe(45);
      expect(result[0].retail_price).toBe(48);
      expect(result[0].trend).toBe('up');
    });

    it('should fall back to English name if commodity not mapped', () => {
      const commodities = [
        {
          nameEn: 'Unknown-Crop',
          minPrice: 100,
          maxPrice: 120,
          trend: 'stable' as const,
        },
      ];

      const result = toMarketPrices(commodities);

      expect(result[0].commodity).toBe('Unknown-Crop');
      expect(result[0].unit).toBe('কেজি');
    });
  });

  describe('COMMODITY_MAP', () => {
    it('should have required rice varieties', () => {
      expect(COMMODITY_MAP['Aman-Fine']).toBeDefined();
      expect(COMMODITY_MAP['Boro-Fine']).toBeDefined();
      expect(COMMODITY_MAP['Aman-Medium']).toBeDefined();
      expect(COMMODITY_MAP['Boro-Medium']).toBeDefined();
      expect(COMMODITY_MAP['Aman-Coarse']).toBeDefined();
      expect(COMMODITY_MAP['Boro-Coarse']).toBeDefined();
    });

    it('should map all items to Bengali names', () => {
      Object.values(COMMODITY_MAP).forEach((item) => {
        expect(item.bn).toBeTruthy();
        expect(item.bn.length).toBeGreaterThan(0);
      });
    });
  });
});