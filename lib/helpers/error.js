export default function ErrorFormatException(msg) {
   try {
	  throw new Error(msg);
	} catch (e) {
	  console.log(e.name + ': ' + e.message);
	  return;
	}
}
