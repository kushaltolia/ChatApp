import useGetConversations from "../../hooks/useGetConversations.jsx";
import Conversation from "./Conversation.jsx";

export default function Conversations() {
	const {loading, conversations} = useGetConversations();
	console.log(conversations);
	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.map((conversation) => (<Conversation key = {conversation._id} conversation = {conversation}/>))}
			{loading ? <span className = "loading loading-spinner mx-auto"></span> : null}
		</div>
	);
};