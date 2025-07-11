#!/usr/bin/env python3
"""
Streamlined Search Orchestrator - Fast search without classification during search
"""

import logging
from typing import Dict, Any, List, Optional
from app.agents.search.streamlined_boe_agent import StreamlinedBOEAgent
from app.agents.search.streamlined_newsapi_agent import StreamlinedNewsAPIAgent
from app.agents.search.streamlined_elpais_agent import StreamlinedElPaisAgent
from app.agents.search.streamlined_expansion_agent import StreamlinedExpansionAgent
from app.agents.search.streamlined_elmundo_agent import StreamlinedElMundoAgent
from app.agents.search.streamlined_abc_agent import StreamlinedABCAgent
from app.agents.search.streamlined_lavanguardia_agent import StreamlinedLaVanguardiaAgent
from app.agents.search.streamlined_elconfidencial_agent import StreamlinedElConfidencialAgent
from app.agents.search.streamlined_eldiario_agent import StreamlinedElDiarioAgent
from app.agents.search.streamlined_europapress_agent import StreamlinedEuropaPressAgent
from app.services.yahoo_finance_service import StreamlinedYahooFinanceAgent

logger = logging.getLogger(__name__)


def get_search_orchestrator() -> "StreamlinedSearchOrchestrator":
    """Factory function to get the streamlined search orchestrator"""
    return StreamlinedSearchOrchestrator()


class StreamlinedSearchOrchestrator:
    """Ultra-fast search orchestrator - data fetching only, classification happens later"""
    
    def __init__(self):
        """Initialize streamlined search agents"""
        self.agents = {
            "boe": StreamlinedBOEAgent(),
            "newsapi": StreamlinedNewsAPIAgent(),
            "elpais": StreamlinedElPaisAgent(),
            "expansion": StreamlinedExpansionAgent(),
            "elmundo": StreamlinedElMundoAgent(),
            "abc": StreamlinedABCAgent(),
            "lavanguardia": StreamlinedLaVanguardiaAgent(),
            "elconfidencial": StreamlinedElConfidencialAgent(),
            "eldiario": StreamlinedElDiarioAgent(),
            "europapress": StreamlinedEuropaPressAgent(),
            "yahoo_finance": StreamlinedYahooFinanceAgent()
        }
    
    async def search_all(
        self,
        query: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        days_back: Optional[int] = 7,
        active_agents: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        FAST search across all active agents - no classification during search
        """
        results = {}
        
        # Determine which agents to use
        if active_agents is None:
            active_agents = list(self.agents.keys())
        
        logger.info(f"🔍 Streamlined search: '{query}' using {active_agents}")
        
        # Search with each active agent in parallel if possible
        for agent_name in active_agents:
            if agent_name not in self.agents:
                logger.warning(f"Unknown agent: {agent_name}")
                continue
                
            try:
                agent = self.agents[agent_name]
                agent_results = await agent.search(
                    query=query,
                    start_date=start_date,
                    end_date=end_date,
                    days_back=days_back
                )
                results[agent_name] = agent_results
                
                result_count = 0
                if agent_name == "boe":
                    result_count = len(agent_results.get("results", []))
                elif agent_name in [
                    "newsapi", "elpais", "expansion", "elmundo", "abc", 
                    "lavanguardia", "elconfidencial", "eldiario", "europapress"
                ]:
                    result_count = len(agent_results.get("articles", []))
                elif agent_name == "yahoo_finance":
                    result_count = len(agent_results.get("financial_data", []))
                
                logger.info(f"✅ {agent_name}: {result_count} results")
                
            except Exception as e:
                logger.error(f"❌ {agent_name} search failed: {e}")
                results[agent_name] = {
                    "error": str(e),
                    "search_summary": {
                        "query": query,
                        "date_range": f"{start_date} to {end_date}",
                        "total_results": 0,
                        "errors": [str(e)]
                    }
                }
        
        return results 