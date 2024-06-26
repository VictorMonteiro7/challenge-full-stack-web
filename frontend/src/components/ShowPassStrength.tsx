import { Box, Progress, Text } from '@radix-ui/themes';

interface Props {
  strength: 0 | 1 | 2 | 3;
}

enum PassStrength {
  FRACA = 0,
  MEDIA = 1,
  BOA = 2,
  FORTE = 3,
}

export const ShowPassStrength = ({ strength }: Props) => {
  const getStrengthColor = (strength: number) => {
    if (strength === PassStrength.FRACA) {
      return 'red';
    }
    if (strength === PassStrength.MEDIA) {
      return 'yellow';
    }
    if (strength === PassStrength.BOA) {
      return 'green';
    }
    return 'blue';
  };
  return (
    <div className='flex gap-2 mt-2 items-center'>
      <Text as='span' color='gray' weight='light' className=''>Força da senha:</Text>
      <div className='flex gap-3 grow'>
        {Array.from({ length: strength + 1 }).map((i, index) => (
          <Box key={index} className='w-1/4'>
            <Progress
              color={getStrengthColor(strength)}
              duration='3s'
              variant='classic'
            />
          </Box>
        ))}
      </div>
    </div>
  );
};
