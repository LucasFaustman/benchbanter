import type {NextPage} from 'next';
import {Layout} from '../components/navbar/layout';
import {Hero} from '../components/hero';
import {Box} from '../components/styles/box';
import {Features1} from '../components/features1';
import {Testimonials} from '../components/tesminonials';
import {Trial} from '../components/trial';
import {Footer} from '../components/footer';

const Home: NextPage = () => {
   return (
      <Layout>
         <Box as="main">
            <Hero />
            <Features1 />
            <Testimonials />
            <Trial />
            <Footer />
         </Box>
      </Layout>
   );
};

export default Home;
