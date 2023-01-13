import React, { Component } from 'react';
import AuthorProfile from '../components/Author/Author';
class Author extends Component {
    render() {
        return (
            <div className="main">
                <AuthorProfile />
            </div>
        );
    }
}

export default Author;