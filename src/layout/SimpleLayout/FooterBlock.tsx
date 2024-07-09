'use client';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import { motion } from 'framer-motion';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { ThemeDirection, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import SendOutlined from '@ant-design/icons/SendOutlined';
import FacebookFilled from '@ant-design/icons/FacebookFilled';
import InstagramFilled from '@ant-design/icons/InstagramFilled';
import LinkedinFilled from '@ant-design/icons/LinkedinFilled';
import TwitterOutlined from '@ant-design/icons/TwitterOutlined';
import { GithubFilled } from '@ant-design/icons';
import LogoMain from 'components/logo/LogoMain';

const imgfooterlogo = 'assets/images/landing/codedthemes-logo.svg';

// link - custom style
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  },
  '&:active': {
    color: theme.palette.primary.main
  }
}));

// ==============================|| LANDING - FOOTER PAGE ||============================== //

type showProps = {
  isFull?: boolean;
};

export default function FooterBlock({ isFull }: showProps) {
  const theme = useTheme();
  const { mode, presetColor } = useConfig();
  const textColor = mode === ThemeMode.DARK ? 'text.primary' : 'background.paper';

  const linkSX = {
    color: theme.palette.common.white,
    fontSize: '1.1rem',
    fontWeight: 400,
    opacity: '0.6',
    cursor: 'pointer',
    '&:hover': {
      opacity: '1'
    }
  };

  const frameworks = [
    { title: 'Rust', link: 'https://www.rust-lang.org/' },
    {
      title: 'Mantis Dashboard',
      link: 'https://mui.com/store/items/mantis-react-admin-dashboard-template/'
    },
    {
      title: 'Next JS',
      link: 'https://nextjs.org/'
    },
    {
      title: 'React Mui',
      link: 'https://mui.com/'
    }
  ];

  const moreProjects = [
    { title: 'Chess Rust', link: 'https://chess.nebuladev.io/' },
    {
      title: 'NebulaDev.io',
      link: 'https://www.nebuladev.io'
    }
  ];

  return (
    <>
      <Box sx={{ pt: isFull ? 0 : 10, pb: 10, bgcolor: 'grey.A700' }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <LogoMain reverse />
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={{ xs: 5, md: 2 }}>
                <Grid item xs={6} sm={3}>
                  <Stack spacing={{ xs: 3, md: 5 }}>
                    <Typography variant="h5" color={textColor} sx={{ fontWeight: 500 }}>
                      Help
                    </Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="" target="_blank" underline="none">
                        Documentation
                      </FooterLink>
                      <FooterLink href="" target="_blank" underline="none">
                        Support
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack spacing={{ xs: 3, md: 5 }}>
                    <Typography variant="h5" color={textColor} sx={{ fontWeight: 500 }}>
                      Legal
                    </Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="" target="_blank" underline="none">
                        Privacy Policy
                      </FooterLink>
                      <FooterLink href="" target="_blank" underline="none">
                        Terms Of Service
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack spacing={{ xs: 3, md: 5 }}>
                    <Typography variant="h5" color={textColor} sx={{ fontWeight: 500 }}>
                      OxideAuth Eco-System
                    </Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      {frameworks.map((item, index) => (
                        <FooterLink href={item.link} target="_blank" underline="none" key={index}>
                          {item.title}
                        </FooterLink>
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Stack spacing={{ xs: 3, md: 5 }}>
                    <Typography variant="h5" color={textColor} sx={{ fontWeight: 500 }}>
                      More Projects
                    </Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      {moreProjects.map((item, index) => (
                        <FooterLink href={item.link} target="_blank" underline="none" key={index}>
                          {item.title}
                        </FooterLink>
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Divider sx={{ borderColor: 'grey.700' }} />
      <Box sx={{ py: 1.5, bgcolor: mode === ThemeMode.DARK ? 'grey.50' : 'grey.800' }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="subtitle2" color="secondary">
                © Made with love by NebulaDev.io
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={2} alignItems="center" sx={{ justifyContent: 'flex-end' }}>
                {/* <Grid item>
                  <Link href="https://www.instagram.com/codedthemes" underline="none" target="_blank" sx={linkSX}>
                    <InstagramFilled />
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="https://twitter.com/codedthemes/status/1768163845858603500" underline="none" target="_blank" sx={linkSX}>
                    <TwitterOutlined />
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="https://in.linkedin.com/company/codedthemes" underline="none" target="_blank" sx={linkSX}>
                    <LinkedinFilled />
                  </Link>
                </Grid> */}
                <Grid item>
                  <Link href="https://github.com/subaquatic-pierre" underline="none" target="_blank" sx={linkSX}>
                    <GithubFilled />
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
