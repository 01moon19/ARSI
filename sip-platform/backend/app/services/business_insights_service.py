from app.services.rag_service import rag_service

PREDEFINED_QUERIES = {

    "summary":
        "Provide a concise business summary from the uploaded sales documents.",

    "growth_opportunities":
        "What are the major growth opportunities mentioned in the documents?",

    "risk_analysis":
        "What are the major business risks or challenges?",

    "top_products":
        "Which products or services appear to perform best?",

    "customer_trends":
        "What customer or market trends are visible?",

    "recommendations":
        "Provide strategic business recommendations based on the uploaded documents."
}


class BusinessInsightService:

    @staticmethod
    def generate_insights():

        insights = {}
        
        for key, query in PREDEFINED_QUERIES.items():
            
            print(f"Running query: {key}")
            try:

                response = rag_service.query(
                    query
                )


                # HANDLE DICT RESPONSE

                if isinstance(response, dict):

                    insights[key] = (
                        response.get("answer")
                        or response.get("result")
                        or str(response)
                    )

                else:

                    insights[key] = str(response)

            except Exception as e:

                insights[key] = (
                    f"Insight generation failed: {str(e)}"
                )

        return insights
        #     "summary":
        #         "Enterprise revenue opportunities are increasing across APAC markets while SMB churn risk remains moderate.",

        #     "growth_opportunities":
        #         "Healthcare and enterprise segments show the highest expansion potential.",

        #     "risk_analysis":
        #         "SMB customer churn and delayed onboarding remain key operational risks.",

        #     "top_products":
        #         "AI Analytics Suite and Sales Intelligence Reports are performing best.",

        #     "customer_trends":
        #         "Customers increasingly prefer AI-assisted analytics and automated reporting.",

        #     "recommendations":
        #         "Increase enterprise targeting, improve SMB retention strategies, and expand AI-powered offerings."
        
        # }