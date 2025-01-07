import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav>
            <ul className="breadcrumb">
                <li><Link to="/">Home</Link></li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    return (
                        <React.Fragment key={to}>
                            {/* Show arrow unless it's the last item */}
                            {index > 0 && <span className="breadcrumb-arrow" style={{color:'white'}}> &gt; </span>}
                            <li>
                                <Link to={to}>{value}</Link>
                            </li>
                        </React.Fragment>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
