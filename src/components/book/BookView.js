import React, { Component } from "react";
import { Grid, Breadcrumb, Header, Button } from "semantic-ui-react";
import { observer, inject } from "mobx-react";
import { BookCard } from "../book-card/BookCard";
import { NoteCard } from "../note-card/NoteCard";
import { Link } from "react-router-dom";
import { Carousel } from "../carousel/Carousel";

@observer
export class BookView extends Component {
  state = {
    descriptionExpanded: false
  };
  componentWillReceiveProps(newProps) {
    const bookId = this.props.match.params.id;
    const newBookId = newProps.match.params.id;
    if (bookId !== newBookId) {
      newProps.fetchBookById(newBookId);
    }
  }
  componentDidMount() {
    this.props.getAllNotes();
    this.props.fetchBookById(this.props.match.params.id);
  }
  toggleDescription = () => {
    this.setState({
      descriptionExpanded: !this.state.descriptionExpanded
    });
  };
  renderDescription(book) {
    if (this.state.descriptionExpanded) {
      return <p>{book.fullDescription}</p>;
    } else {
      return <p>{book.description}</p>;
    }
  }
  renderToggleDescriptionButton() {
    if (this.state.descriptionExpanded) {
      return <Button onClick={this.toggleDescription}>Show less</Button>;
    } else {
      return <Button onClick={this.toggleDescription}>Show more</Button>;
    }
  }
  render() {
    const book = this.props.books.get(this.props.match.params.id);

    if (this.props.bookFetchError) {
      return <p>{this.props.bookFetchError}</p>;
    }
    if (!book) {
      return <p>Book loading</p>;
    }
    const notes = this.props.notesByBookId[book.isbn10] || [];
    return (
      <Grid>
        <Grid.Row>
          <Breadcrumb>
            <Breadcrumb.Section><Link to="/">Home</Link></Breadcrumb.Section>
            <Breadcrumb.Divider> > </Breadcrumb.Divider>
            <div className="active section">{book.title} </div>
          </Breadcrumb>
        </Grid.Row>

        <Grid.Column computer={5}>
          <BookCard key={this.props.match.params.id} thumbnail={book.image} />
        </Grid.Column>
        <Grid.Column computer={9}>
          <Header as="h1">The Book </Header>
          {this.renderDescription(book)}
          {this.renderToggleDescriptionButton()}
        </Grid.Column>

        <Grid.Row>
            
        <Carousel
          style={{ minHeight: "220px" }}
          items={notes}
          renderItem={note => (
            <Link to={"/notes/" + note.id} key={note.id}>
              <NoteCard
                key={note.id}
                title={note.bookId}
                isFav={note.isFav}
                meta={note.date_modified}
                description={note.content}
              />
            </Link>
          )}
          itemKey={"id"}
          perPage={3}
        />
                </Grid.Row>

        <Link to={`/books/${book.isbn10}/create`}>
          <Button>Create new note.</Button>
        </Link>
      </Grid>
    );
  }
}
export const BookViewContainer = inject(stores => {
  return {
    notesByBookId: stores.notesStore.notesByBookId,
    getAllNotes: stores.notesStore.getAllNotes,
    fetchBookById: stores.booksStore.fetchBookById,
    books: stores.booksStore.books,
    bookFetchError: stores.booksStore.bookFetchError
  };
})(BookView);
