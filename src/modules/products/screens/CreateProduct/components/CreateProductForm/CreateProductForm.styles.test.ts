import { styles } from './CreateProductForm.styles';

describe('CreateProductForm Styles', () => {
  it('should export styles object', () => {
    expect(styles).toBeDefined();
    expect(typeof styles).toBe('object');
  });

  it('should have formContainer style', () => {
    expect(styles.formContainer).toBeDefined();
    expect(styles.formContainer.paddingHorizontal).toBe(20);
  });

  it('should have section style', () => {
    expect(styles.section).toBeDefined();
    expect(styles.section.marginBottom).toBe(32);
  });

  it('should have sectionTitle style', () => {
    expect(styles.sectionTitle).toBeDefined();
    expect(styles.sectionTitle.fontSize).toBe(18);
    expect(styles.sectionTitle.fontWeight).toBe('600');
    expect(styles.sectionTitle.color).toBe('#333333');
    expect(styles.sectionTitle.marginBottom).toBe(12);
  });

  it('should have sectionDescription style', () => {
    expect(styles.sectionDescription).toBeDefined();
    expect(styles.sectionDescription.fontSize).toBe(14);
    expect(styles.sectionDescription.color).toBe('#667085');
    expect(styles.sectionDescription.marginBottom).toBe(20);
    expect(styles.sectionDescription.lineHeight).toBe(20);
  });

  it('should have radioGroup style', () => {
    expect(styles.radioGroup).toBeDefined();
    expect(styles.radioGroup.gap).toBe(16);
  });

  it('should have radioOption style', () => {
    expect(styles.radioOption).toBeDefined();
    expect(styles.radioOption.flexDirection).toBe('row');
    expect(styles.radioOption.alignItems).toBe('center');
    expect(styles.radioOption.backgroundColor).toBe('#FFFFFF');
    expect(styles.radioOption.padding).toBe(20);
    expect(styles.radioOption.borderRadius).toBe(12);
  });

  it('should match snapshot', () => {
    expect(styles).toMatchSnapshot();
  });
});
