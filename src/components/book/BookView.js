import React, { Component } from "react";
import { Grid, Breadcrumb, Header, Button, List, Menu, Icon, Rating, Divider, Message } from "semantic-ui-react";
import { observer, inject } from "mobx-react";
import { BookCard } from "../book-card/BookCard";
import { NoteViewContainer } from "../note-card/NoteCard";
import { Link } from "react-router-dom";
import { Carousel } from "../carousel/Carousel";

@observer
export class BookView extends Component {
  state = {
    descriptionExpanded: false,
    activeItem: "th-btn"
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
      return <Button size ="tiny" onClick={this.toggleDescription}> Show less </Button>;
    } else {
      return <Button size ="tiny" onClick={this.toggleDescription}>Show more </Button>;
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  renderNotesCarousel = (notes) => {
    return <Carousel
        style={{minHeight: "280px", display:"block"}}
        items={notes}
        renderItem={note => (
            <Link to={"/notes/" + note.id} key={note.id}>
                <NoteViewContainer
                  key={note.id}
                  noteId={note.id}
                  title={note.title}
                  isFav={note.isFav}
                  meta={note.dateModified}
                  description={note.content}
                  tags={note.tags}
                />
            </Link>
        )}
        itemKey={"id"}
        perPage={3}
    />
  }
  renderNotesList = (notes) => {
    return  <List
        style={{display:"block", width: "100%" }}>
        {notes.map(note => (
            <Link to={"/notes/" + note.id} key={note.id}>
                <NoteViewContainer
                  key={note.id}
                  noteId={note.id}
                  listitem                   
                  title={note.title}
                  isFav={note.isFav}
                  meta={note.dateModified}
                  description={note.content}
                  tags={note.tags}
                />
            </Link>
        ))}
    </List>
  }
  renderNotes = (notes) => {
    if (notes.length === 0) {
      return <Header as="h3">Click on the Plus (+) icon to start creating a new note</Header>
    }
    if (this.state.activeItem === 'th-btn') {
      return this.renderNotesCarousel(notes)
    }
    return this.renderNotesList(notes)

  }

  render() {
    const book = this.props.books.get(this.props.match.params.id);
    if (this.props.bookFetchError) {
      return <p>{this.props.bookFetchError}</p>;
    }
    if (!book) {
      return ( 
        <Message icon>
          <Icon name='circle notched' loading />
          <Message.Content>
            <Message.Header>Just one second</Message.Header>
            Loading Book
          </Message.Content>
        </Message>
      );
    }
    const notes = this.props.notesByBookId[book.isbn10] || [];
    return (
      <div>
        <Grid>
          <Grid.Row>
            <Breadcrumb>
              <Breadcrumb.Section><Link to="/">Home</Link></Breadcrumb.Section>
              <Breadcrumb.Divider> > </Breadcrumb.Divider>
              <div className="active section">{book.title} </div>
            </Breadcrumb>
          </Grid.Row>

          <Grid.Column computer={5}>
            <BookCard 
              bookId={this.props.match.params.id} 
              key={this.props.match.params.id} 
              thumbnail={book.image} 
              numberOfNotes={notes.length}
            />
          </Grid.Column>
          <Grid.Column computer={9}>
            <Header as="h2">{book.title} 
              <Header.Subheader>
                by {book.authors.join(', ')} 
                <Divider/>
                <Rating disabled maxRating="5" rating={book.rating} /> {book.rating}
              </Header.Subheader>
            </Header>
            {this.renderDescription(book)}
            {this.renderToggleDescriptionButton()}
          </Grid.Column>
        </Grid>
        <Header block as="h2">
          Notes
          {notes.length > 0 ? ( <Menu size="tiny" floated="right">
            <Menu.Item name='th-btn' active={this.state.activeItem === 'th-btn'} onClick={this.handleItemClick}>
              <Icon className='th'/>
            </Menu.Item>
            <Menu.Item name='list-btn' active={this.state.activeItem === 'list-btn'} onClick={this.handleItemClick}>
              <Icon name = 'list'/>
            </Menu.Item>
          </Menu>) :(null)}
         
          <Menu size="tiny" floated="right">
            <Link to={`/books/${book.isbn10}/create`}>
              <Menu.Item>
                <Icon name = 'plus'/>
              </Menu.Item>
            </Link>
          </Menu>

        </Header>

        {this.renderNotes(notes)}
      </div>
    );
  }
}
export const BookViewContainer = inject(stores => {
  return {
    notes: stores.notesStore.notes,
    notesByBookId: stores.notesStore.notesByBookId,
    getAllNotes: stores.notesStore.getAllNotes,
    updateNote: stores.notesStore.updateNote,
    deleteNote: stores.notesStore.deleteNote,
    fetchBookById: stores.booksStore.fetchBookById,
    books: stores.booksStore.books,
    bookFetchError: stores.booksStore.bookFetchError
  };
})(BookView);
