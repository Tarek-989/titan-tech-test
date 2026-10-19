import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ProductGalleryProps {
  title: string;
  images: string[];
}

export function ProductGallery({ title, images }: ProductGalleryProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <Stack spacing={1.5}>
      <Paper
        variant="outlined"
        sx={{ aspectRatio: '1 / 1', overflow: 'hidden', bgcolor: 'grey.50' }}
      >
        {current && (
          <Box
            component="img"
            src={current}
            alt={title}
            sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        )}
      </Paper>
      {images.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
          {images.map((image, index) => (
            <ButtonBase
              key={image}
              onClick={() => setSelected(index)}
              aria-label={t('productDetails.showImage', { index: index + 1 })}
              aria-pressed={index === selected}
              sx={{
                flexShrink: 0,
                width: 72,
                height: 72,
                borderRadius: 1,
                overflow: 'hidden',
                border: 2,
                borderColor: index === selected ? 'primary.main' : 'divider',
                bgcolor: 'grey.50',
              }}
            >
              <Box
                component="img"
                src={image}
                alt=""
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </ButtonBase>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
