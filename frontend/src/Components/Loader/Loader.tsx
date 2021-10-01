import CircleLoader from 'react-spinners/CircleLoader';

const css = `
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`;

const Loader = ({ loading }) => <CircleLoader css={css} color="#3242cd" loading={loading} size={200} />;

export default Loader;