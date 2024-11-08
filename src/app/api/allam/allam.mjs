import rawPrompt from "./prompt.json" assert { type: "json" };
const getToken = async (apiKey) => {

	const { access_token } = await fetch('https://iam.cloud.ibm.com/identity/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
			apikey: apiKey
		})
	})
		.then(response => response.json())

	return access_token;

}

export const generateText = async (token, question, type) => {
	const url = "https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
	const headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": `Bearer ${token}`
	};
	const prompt = rawPrompt[type];
	console.log(prompt);
	const body = {

		input: `<s> [INST]
		<<SYS>>
		
		instruction on how to do the task:
		${prompt.SYS}
       ${prompt.language} 
	   ${prompt.chainOfThought}
		<</SYS>>
		Question:
		${question} 
		 

		
		
		[/INST]`,
		parameters: {
			decoding_method: "greedy",
			max_new_tokens: 1000,
			min_new_tokens: 0,
			stop_sequences: ["|/stop|"],
			repetition_penalty: 1
		},
		model_id: "sdaia/allam-1-13b-instruct",
		project_id: "43e85ced-b69e-4504-a3ee-8d1bbd0b0b65"
	};

	const response = await fetch(url, {
		headers,
		method: "POST",
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		throw new Error("Non-200 response");
	}

	return await response.json();
}
//علام
export const askAllam = async (question, type) => {
	const token = await getToken("");
	const response = await generateText(token, question, type);
	return response.results[0].generated_text;
}



