type NoteSection = {
  key: string;
  title: string;
  text: string;
  content: string[];
};

type GeneratedNoteProps = {
   note: NoteSection[]
};

function NoteItem(props:GeneratedNoteProps) {
  return <div className="note__tab">
   {props.note.map(item => (
      <div className="note__section">
         <h4 className="title">{item.title}</h4>
         <div className="note__content">
            {item.content.map(content => (
               <p>- {content}</p>
            ))}
         </div>
      </div>
   ))}
  </div>;
}

export default NoteItem;