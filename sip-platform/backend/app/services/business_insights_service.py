from app.services.rag_service import rag_service

PREDEFINED_QUERIES = {

    "summary":
        """
        Provide a concise business summary
        in 1 short sentence only.
        Keep the response executive-style
        and under 60 words.
        do not include the source of the data in the response.
        """,

    "growth_opportunities":
        """
        Identify the biggest growth opportunities.
        Respond in 1 concise sentence only.
        Avoid long explanations.
        do not include the source of the data in the response.      
        """,

    "risk_analysis":
        """
        Identify the key business risks.
        Keep the response short,
        actionable,
        and under 50 words.
        do not include the source of the data in the response.
        """,

    "top_products":
        """
        Mention the top performing products
        or services in 1 concise sentence only.
        do not include the source of the data in the response.
        """,

    "customer_trends":
        """
        Summarize important customer trends
        in 1 short sentence only.
        do not include the source of the data in the response.
        """,

    "recommendations":
        """
        Provide 1 short strategic recommendations.
        Keep the response concise
        and executive-friendly.
        do not include the source of the data in the response.
        
        """

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
                    f"insights[key] = AI insight temporarily unavailable."
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