import { toast } from "react-hot-toast"
import { Icon, Popup } from "semantic-ui-react"
import { toClipboard } from "../utils/FnUtils"

const IdToCopy = ({ id, noShowId, text, textToClipboard }) => {
    const copy = () => {
        toClipboard(textToClipboard || id)
        toast('Copiado!', { id: 'clipboard' })
    }
    return (
        <span className="text-muted text-small no-margin">
            {
                noShowId ?
                    <Popup
                        content={text ? `${text} ${id}` : `Copiar: ${id}`}
                        trigger={<Icon name="hashtag" link onClick={() => copy()} />}
                        size='tiny'
                        inverted
                    />
                    :
                    <>
                        {id}
                        <Popup
                            content={text ? text : 'Copiar'}
                            trigger={<Icon name="copy" link onClick={() => copy()} />}
                            size='tiny'
                            inverted
                        />
                    </>
            }


        </span>
    )
}

export default IdToCopy