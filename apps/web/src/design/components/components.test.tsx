import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { categoryVisuals, getCategoryVisual } from '../categories';
import { getIcon, iconNames } from '../icons/registry';
import { Button } from './Button';
import { CategoryBadge } from './CategoryBadge';
import { CategoryChip } from './CategoryChip';
import { Icon } from './Icon';
import { Meta } from './Meta';
import { Photo } from './Photo';

describe('registro de ícones', () => {
  it('tem todos os ícones do conjunto provisório', () => {
    expect(iconNames.sort()).toEqual(
      [
        'category-breads',
        'category-greens',
        'category-pot',
        'category-sweets',
        'favorite',
        'menus',
        'photo',
        'recipes',
        'search',
        'servings',
        'time',
      ].sort(),
    );
    for (const name of iconNames) {
      expect(getIcon(name)).toBeTypeOf('function');
    }
  });
});

describe('categorias', () => {
  it('cada categoria usa os três tokens dela e um ícone do registro', () => {
    for (const [slug, visual] of Object.entries(categoryVisuals)) {
      expect(visual.color).toBe(`var(--color-category-${slug})`);
      expect(visual.onColor).toBe(`var(--color-category-${slug}-on)`);
      expect(visual.tint).toBe(`var(--color-category-${slug}-tint)`);
      expect(iconNames).toContain(visual.icon);
    }
  });

  it('categoria sem visual próprio cai nas cores da casa', () => {
    expect(getCategoryVisual('nova')).toMatchObject({
      color: 'var(--color-brand)',
      icon: 'recipes',
    });
  });
});

describe('Icon', () => {
  it('é decorativo por padrão', () => {
    const { container } = render(<Icon name="time" size={22} />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '22');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
  });

  it('com label, vira imagem com nome acessível', () => {
    render(<Icon name="favorite" label="Favorita" />);

    expect(screen.getByRole('img', { name: 'Favorita' })).toHaveAttribute('fill', 'currentColor');
  });
});

describe('CategoryBadge', () => {
  it('usa a cor e o ícone da categoria no tamanho pedido', () => {
    const { container } = render(<CategoryBadge slug="breads" size={52} />);
    const badge = container.firstElementChild as HTMLElement;

    expect(badge.style.getPropertyValue('--badge-size')).toBe('52px');
    expect(badge.style.getPropertyValue('--badge-color')).toBe('var(--color-category-breads)');
    expect(badge.style.getPropertyValue('--badge-on-color')).toBe(
      'var(--color-category-breads-on)',
    );
  });
});

describe('CategoryChip', () => {
  it('é um link com o selo e o nome', () => {
    render(<CategoryChip slug="sweets" name="Bolos e doces" href="/?categoria=sweets" current />);

    const link = screen.getByRole('link', { name: 'Bolos e doces' });
    expect(link).toHaveAttribute('href', '/?categoria=sweets');
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});

describe('Button', () => {
  it('é um botão do tipo button por padrão', () => {
    render(<Button variant="brand">Entrar</Button>);

    expect(screen.getByRole('button', { name: 'Entrar' })).toHaveAttribute('type', 'button');
  });

  it('com href, vira link', () => {
    render(
      <Button variant="outline" href="/receitas">
        Ver receitas
      </Button>,
    );

    expect(screen.getByRole('link', { name: 'Ver receitas' })).toHaveAttribute('href', '/receitas');
  });
});

describe('Photo', () => {
  it('mostra a foto com o texto alternativo', () => {
    render(<Photo src="/fotos/a/card.webp" alt="Bolo na forma" ratio="4/5" />);

    const image = screen.getByRole('img', { name: 'Bolo na forma' });
    expect(image).toHaveAttribute('src', '/fotos/a/card.webp');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('sem foto, mostra o tom claro da categoria, o ícone de foto e a legenda', () => {
    const { container } = render(<Photo alt="" ratio="4/5" categorySlug="pot" />);
    const frame = container.firstElementChild as HTMLElement;

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Sem foto ainda')).toBeVisible();
    expect(frame.style.getPropertyValue('--photo-tint')).toBe('var(--color-category-pot-tint)');
    expect(frame.style.getPropertyValue('--photo-ratio')).toBe('4/5');
    expect(frame.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Meta', () => {
  it('mostra o valor e diz o que ele significa para leitores de tela', () => {
    render(
      <Meta icon="time" label="Tempo de preparo">
        40 min
      </Meta>,
    );

    expect(screen.getByText('40 min')).toBeVisible();
    expect(screen.getByText(/Tempo de preparo/)).toBeInTheDocument();
  });
});
